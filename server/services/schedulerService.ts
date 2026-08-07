import cron from "node-cron";
import supabase from "../config/supabase.js";
import zernio from "../config/zernio.js";

export const processDuePosts = async () => {
  try {
    const now = new Date().toISOString();

    const { data: candidates, error: fetchErr } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_for", now);

    if (fetchErr || !candidates || candidates.length === 0) {
      return;
    }

    for (const candidate of candidates) {
      // Atomically lock the post so concurrent requests don't duplicate publication
      const { data: post, error: lockErr } = await supabase
        .from("posts")
        .update({ status: "processing", updated_at: new Date().toISOString() })
        .eq("id", candidate.id)
        .eq("status", "scheduled")
        .select()
        .maybeSingle();

      if (lockErr || !post) continue;

      try {
        const { data: accounts, error: accErr } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", post.user_id)
          .eq("status", "connected")
          .not("zernio_account_id", "is", null);

        const matchingAccounts = (accounts || []).filter((acc) =>
          (post.platforms || []).includes(acc.platform)
        );

        if (accErr || matchingAccounts.length === 0) {
          console.log(`No connected Zernio Accounts found for post ${post.id}`);
          const errorReason = `No connected ${(post.platforms || []).join(", ")} account found. Please reconnect your account on the Accounts page.`;
          
          await supabase
            .from("posts")
            .update({
              status: "failed",
              error_reason: errorReason,
              updated_at: new Date().toISOString(),
            })
            .eq("id", post.id);

          continue;
        }

        const zernioPlatforms = matchingAccounts.map((acc) => ({
          platform: acc.platform as any,
          accountId: acc.zernio_account_id!,
        }));

        const payload = {
          content: post.content,
          publishNow: true,
          ...(post.media_url ? { mediaItems: [{ type: post.media_type || "image", url: post.media_url }] } : {}),
          platforms: zernioPlatforms,
        };

        console.log(`Publishing post ${post.id} to Zernio with media: ${post.media_url || "none"}`);

        const response = await zernio.posts.createPost({
          body: payload,
        });

        const publishedPost = (response.data as any)?.post || response.data;

        if (!publishedPost) {
          throw new Error("failed to get post object from Zernio response");
        }

        console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);

        await supabase
          .from("posts")
          .update({
            status: "published",
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);

        await supabase
          .from("activity_logs")
          .insert([
            {
              user_id: post.user_id,
              action_type: "POST_PUBLISHED",
              description: `Published post to ${matchingAccounts.map((a) => a.platform).join(", ")}`,
              related_post_id: post.id,
            },
          ]);
      } catch (err: any) {
        const rawError = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to publish post";
        console.error(`Failed to publish post ${post.id} :`, err?.response?.data || err?.message);
        
        const errorReason = typeof rawError === "object" ? JSON.stringify(rawError) : rawError;

        await supabase
          .from("posts")
          .update({
            status: "failed",
            error_reason: errorReason,
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);
      }
    }

    console.log(`Evaluated ${candidates.length} due posts at ${now}`);
  } catch (error) {
    console.log("Error in scheduler:", error);
  }
};

export const initScheduler = () => {
  // Run scheduler check every 10 seconds in persistent environments
  cron.schedule("*/10 * * * * *", async () => {
    await processDuePosts();
  });

  console.log("Schedule Service Initialized");
};