import { AuthRequest } from "../middleware/authMiddleware.js";
import { Request, Response } from "express";
import { Groq } from "groq-sdk";
import axios from "axios";
import supabase from "../config/supabase.js";
import { uploadFileToStorage } from "../services/storageService.js";
import { processDuePosts } from "../services/schedulerService.js";
import fs from "fs";
import path from "path";

// Generate Post
// POST /api/posts/generate
export const generatePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      res.status(400).json({
        message: "Groq API key is missing. Please add it in your server/.env file.",
      });
      return;
    }

    const groq = new Groq({ apiKey });

    let textResponse: any;
    const modelsToTry = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

    for (const modelName of modelsToTry) {
      try {
        textResponse = await groq.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "user",
              content: `You are an expert social media manager. 
                Write an engaging, detailed, and high-converting social media post based on this request: "${prompt}". 
                
                Rules:
                - The tone must be ${tone}.
                - The post must be at least 3 to 5 sentences long.
                - Include engaging hooks, line breaks, and relevant trending hashtags.
                - Return ONLY a valid JSON object with two keys: "content" and "imagePrompt". 
                - The "imagePrompt" must be a highly detailed visual description for an AI image generator that complements the post text.`,
            },
          ],
          response_format: { type: "json_object" },
        });
        if (textResponse) break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed: ${err?.message || err}. Trying next...`);
      }
    }

    let content = "";
    let imagePrompt = prompt;

    if (textResponse) {
      try {
        const rawText = textResponse.choices?.[0]?.message?.content || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const data = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : { content: rawText, imagePrompt: prompt };
        content = data.content;
        imagePrompt = data.imagePrompt;
      } catch (e) {
        content = textResponse.choices?.[0]?.message?.content || "";
      }
    } else {
      content = `🚀 ${prompt}\n\nWe are excited to share this update with you! Stay tuned for more details.\n\n#${tone.toLowerCase()} #updates #trending`;
      imagePrompt = prompt;
    }

    let mediaUrl = "";
    if (generateImage) {
      const cleanPrompt = (imagePrompt || prompt)
        .replace(/[^\w\s,.-]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const seed = Math.floor(Math.random() * 1000000);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=768&nologo=true&seed=${seed}`;

      const lowerText = (prompt + " " + imagePrompt).toLowerCase();
      let fallbackImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1024&q=80";

      if (lowerText.match(/c\+\+|code|coding|program|developer|software|internship|tech|python|java|web/i)) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1024&q=80";
      } else if (lowerText.match(/coffee|cafe|bean|drink|espresso/i)) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1024&q=80";
      } else if (lowerText.match(/gym|fitness|workout|health|exercise|sport/i)) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1024&q=80";
      } else if (lowerText.match(/team|business|office|meeting|company|work/i)) {
        fallbackImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1024&q=80";
      }

      try {
        console.log("Generating AI image for prompt:", cleanPrompt);
        const response = await axios.get(pollinationsUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
        });
        const imageBuffer = Buffer.from(response.data);

        mediaUrl = await uploadFileToStorage(
          imageBuffer,
          `ai-${seed}.jpg`,
          "image/jpeg",
          "ai_generations"
        );
      } catch (err: any) {
        console.warn("AI generation upload to Supabase Storage failed, using domain-matched fallback photo:", fallbackImageUrl, err?.message || err);
        mediaUrl = fallbackImageUrl;
      }
    }

    const userId = req.user._id || req.user.id;
    const { data: generation, error } = await supabase
      .from("generations")
      .insert([
        {
          user_id: userId,
          prompt,
          content,
          media_url: mediaUrl || null,
          media_type: mediaUrl ? "image" : null,
          tone,
        },
      ])
      .select()
      .single();

    if (error || !generation) {
      res.status(500).json({ message: error?.message || "Failed to save AI generation" });
      return;
    }

    res.json({
      ...generation,
      _id: generation.id,
      user: generation.user_id,
      mediaUrl: generation.media_url,
      mediaType: generation.media_type,
      createdAt: generation.created_at,
    });
  } catch (error: any) {
    console.error("Generate Post error:", error.message || error);
    res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

// Get Generations
// GET /api/posts/generations
export const getGenerations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user._id || req.user.id;
    const { data: generations, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const formatted = (generations || []).map((gen) => ({
      ...gen,
      _id: gen.id,
      user: gen.user_id,
      mediaUrl: gen.media_url,
      mediaType: gen.media_type,
      createdAt: gen.created_at,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Get Posts
// GET /api/posts
export const getPosts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    await processDuePosts();
    const userId = req.user._id || req.user.id;

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const formatted = (posts || []).map((p) => ({
      ...p,
      _id: p.id,
      user: p.user_id,
      mediaUrl: p.media_url,
      mediaType: p.media_type,
      scheduledFor: p.scheduled_for,
      errorReason: p.error_reason,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Trigger Cron for Vercel/External Crons
// GET /api/posts/cron
export const triggerCron = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    await processDuePosts();
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Cron Error" });
  }
};

// Schedule Post
// POST /api/posts
export const schedulePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { content, platforms, scheduledFor, status } = req.body;

    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (e) {
        parsedPlatforms = platforms.split(",");
      }
    }

    let mediaUrl: string | undefined = req.body.mediaUrl;
    let mediaType: "image" | "video" | undefined = req.body.mediaType;

    if (req.file) {
      try {
        mediaUrl = await uploadFileToStorage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          "social-scheduler"
        );
        mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
      } catch (uploadErr: any) {
        console.warn("Supabase Storage upload failed. Falling back to local storage...", uploadErr?.message || uploadErr);
        try {
          const uploadsDir = path.join(process.cwd(), "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const ext = path.extname(req.file.originalname) || (req.file.mimetype.includes("video") ? ".mp4" : ".png");
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, req.file.buffer);

          const host = req.headers.host || "localhost:3000";
          const protocol = req.protocol || "http";
          mediaUrl = `${protocol}://${host}/uploads/${filename}`;
          mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
        } catch (localErr: any) {
          console.error("Local upload fallback failed:", localErr);
          res.status(500).json({ message: "Media upload failed on both Supabase Storage and local storage." });
          return;
        }
      }
    }

    const userId = req.user._id || req.user.id;
    const { data: post, error } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          content,
          platforms: parsedPlatforms,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
          scheduled_for: scheduledFor,
          status: status || "scheduled",
        },
      ])
      .select()
      .single();

    if (error || !post) {
      res.status(500).json({ message: error?.message || "Failed to schedule post" });
      return;
    }

    res.status(201).json({
      ...post,
      _id: post.id,
      user: post.user_id,
      mediaUrl: post.media_url,
      mediaType: post.media_type,
      scheduledFor: post.scheduled_for,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Delete Post
// DELETE /api/posts/:id
export const deletePost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const { data: post, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error || !post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};