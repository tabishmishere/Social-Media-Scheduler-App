import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoute.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoute.js";
import { serve } from "inngest/express";
import { inngest } from "./config/inngest.js";
import { inngestFunctions } from "./inngest/inngestFunctions.js";

import path from "path";
import fs from "fs";

// Create uploads folder safely (Vercel filesystem is read-only outside /tmp)
const uploadsDir = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create uploads directory:", err);
}

const app = express();

// Ensure DB is connected per request
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth", authRouter);
app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);
app.use("/api/activity", activityRouter);
app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err.message);
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;