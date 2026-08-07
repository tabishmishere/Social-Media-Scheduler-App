import express from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const socialAuthRouter = express.Router();


socialAuthRouter.get('/sync', protect, syncAccounts)
socialAuthRouter.get('/:platform/url', protect, generateAuthUrl)


export default socialAuthRouter;