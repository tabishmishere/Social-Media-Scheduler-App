import { AuthRequest } from "../middleware/authMiddleware.js";
import { Response } from "express";
import supabase from "../config/supabase.js";
import zernio from "../config/zernio.js";

// Get All accounts
// GET /api/accounts
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id || req.user.id;
    const { data: accounts, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const formatted = (accounts || []).map((acc) => ({
      ...acc,
      _id: acc.id,
      user: acc.user_id,
      avatarUrl: acc.avatar_url,
      zernioAccountId: acc.zernio_account_id,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Add account
// POST /api/accounts
export const addAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id || req.user.id;
    const { platform, handle, avatarUrl } = req.body;

    const { data: account, error } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: userId,
          platform,
          handle,
          avatar_url: avatarUrl,
        },
      ])
      .select()
      .single();

    if (error || !account) {
      res.status(500).json({ message: error?.message || "Failed to add account" });
      return;
    }

    res.status(201).json({
      ...account,
      _id: account.id,
      user: account.user_id,
      avatarUrl: account.avatar_url,
      zernioAccountId: account.zernio_account_id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Disconnect Account
// DELETE /api/accounts/:id
export const disconnectAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id || req.user.id;
    const { data: account, error: fetchErr } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchErr || !account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    if (account.zernio_account_id) {
      try {
        await zernio.accounts.deleteAccount({ path: { accountId: account.zernio_account_id } });
      } catch (error: any) {
        res.status(500).json({ message: error?.response?.data?.message || error?.message });
        return;
      }
    }

    const { error: deleteErr } = await supabase
      .from("accounts")
      .delete()
      .eq("id", account.id);

    if (deleteErr) {
      res.status(500).json({ message: deleteErr.message });
      return;
    }

    res.json({ message: "Account disconnected Successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};
