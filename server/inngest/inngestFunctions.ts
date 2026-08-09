import { inngest } from "../config/inngest.js";
import { processDuePosts } from "../services/schedulerService.js";

/**
 * Inngest cron function: checks for due posts every minute and publishes them.
 * Replaces the old node-cron polling loop that ran every 10 seconds.
 */
export const processDuePostsCron = inngest.createFunction(
  {
    id: "process-due-posts-cron",
    name: "Process Due Posts (Cron)",
    triggers: [{ cron: "* * * * *" }],
  },
  async ({ step }) => {
    const result = await step.run("check-and-publish-due-posts", async () => {
      await processDuePosts();
      return { processed: true, timestamp: new Date().toISOString() };
    });
    return result;
  }
);

/**
 * Inngest event function: triggered on-demand to process due posts immediately.
 * Used by the /api/posts/cron endpoint and after scheduling a post.
 */
export const processDuePostsEvent = inngest.createFunction(
  {
    id: "process-due-posts-event",
    name: "Process Due Posts (Event)",
    triggers: [{ event: "post/check.due" }],
  },
  async ({ step }) => {
    const result = await step.run("check-and-publish-due-posts", async () => {
      await processDuePosts();
      return { processed: true, timestamp: new Date().toISOString() };
    });
    return result;
  }
);

/** All Inngest functions to register with the serve handler */
export const inngestFunctions = [processDuePostsCron, processDuePostsEvent];
