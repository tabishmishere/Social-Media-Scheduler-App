import { AuthRequest } from "../middleware/authMiddleware.js";
import { Response } from "express";
import supabase from "../config/supabase.js";

// Get all activity
// GET /api/activity
export const getActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id || req.user.id;
    const { data: activity, error } = await supabase
      .from("activity_logs")
      .select("*, posts:related_post_id(content)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const formatted = (activity || []).map((act: any) => ({
      ...act,
      _id: act.id,
      user: act.user_id,
      actionType: act.action_type,
      createdAt: act.created_at,
      relatedPost: act.posts ? { content: act.posts.content } : null,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};