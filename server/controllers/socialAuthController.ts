import zernio from "../config/zernio.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";
import { Response } from "express";

const getOrCreateZernioProfile = async (user: any): Promise<string> => {
  try {
    const result = await zernio.profiles.listProfiles();
    const data = result.data as any;
    const profiles: any[] = Array.isArray(data)
      ? data
      : data?.profiles || data?.data || [];

    const userId = user._id || user.id;

    if (profiles.length > 0) {
      const pid = profiles[0]._id || profiles[0].id;
      await supabase
        .from("users")
        .update({ zernio_profile_id: pid })
        .eq("id", userId);
      return pid;
    }

    const createResult = await zernio.profiles.createProfile({
      body: { name: `${user.name} (${user.email})'s workspace` } as any,
    });

    const created = (createResult.data as any)?.profile || createResult.data;
    const pid = created?._id || created?.id;

    if (!pid) {
      throw new Error("Failed to create Zernio profile - No id returned");
    }

    await supabase
      .from("users")
      .update({ zernio_profile_id: pid })
      .eq("id", userId);
    return pid;
  } catch (error: any) {
    console.error(
      "Error in getOrCreateZernioProfile:",
      error?.message || error,
    );
    throw error;
  }
};

// Generate OAuth authorization URL for a given platform
export const generateAuthUrl = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { platform } = req.params;
    const profileId = await getOrCreateZernioProfile(req.user);

    const origin = req.headers.origin || "http://localhost:5173";
    const redirectUri = `${origin}/accounts`;

    const result = await zernio.connect.getConnectUrl({
      path: { platform: platform as any },
      query: {
        profileId,
        redirect_url: redirectUri,
      },
    });

    const data = result.data as any;
    console.log("getConnectUrl response:", JSON.stringify(data, null, 2));

    const authUrl = data.authUrl || data.url;
    if (!authUrl) {
      throw new Error(
        `Zernio returned no authUrl, full response: ${JSON.stringify(data)}`,
      );
    }

    res.json({ url: authUrl });
  } catch (error: any) {
    console.error("Error in generateAuthUrl:", error?.message || error);
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// Sync connected account from zernio into our database
export const syncAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const profileId = await getOrCreateZernioProfile(req.user);

    const result = await zernio.accounts.listAccounts({
      query: { profileId } as any,
    });

    const data = result.data as any;
    const zernioAccounts: any[] =
      data?.accounts || (Array.isArray(data) ? data : []);
    const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
    const syncedAccounts = [];

    const userId = req.user._id || req.user.id;

    for (const zAccount of zernioAccounts) {
      const zid = zAccount._id || zAccount.id;
      if (!zid) {
        console.warn("Skipping account with no ID: ", zAccount);
        continue;
      }

      const rawPlatform = (
        zAccount.platform ||
        zAccount.type ||
        ""
      ).toLowerCase();
      const normalizedPlatform = supportedPlatforms.find((p) =>
        rawPlatform.includes(p),
      );

      if (!normalizedPlatform) {
        console.log(`Skipping unsupported platform: "${rawPlatform}"`);
        continue;
      }

      const { data: account, error } = await supabase
        .from("accounts")
        .upsert(
          {
            user_id: userId,
            platform: normalizedPlatform,
            handle: zAccount.username || zAccount.handle || "Unknown",
            zernio_account_id: zid,
            status: "connected",
            avatar_url:
              zAccount.avatarUrl ||
              zAccount.picture ||
              zAccount.profile_image_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "zernio_account_id" }
        )
        .select()
        .single();

      if (error) {
        console.error("Error upserting account into Supabase:", error);
        continue;
      }

      syncedAccounts.push({
        ...account,
        _id: account.id,
        user: account.user_id,
        avatarUrl: account.avatar_url,
        zernioAccountId: account.zernio_account_id,
      });
    }

    res.json(syncedAccounts);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};
