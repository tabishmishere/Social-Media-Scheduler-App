import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fall back secret");

      const { data: user, error } = await supabase
        .from("users")
        .select("id, name, email, zernio_profile_id")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      req.user = {
        ...user,
        _id: user.id,
        zernioProfileId: user.zernio_profile_id,
      };

      next();
    } catch (error: any) {
      res.status(401).json({ message: error?.message || "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};