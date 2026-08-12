import { Router } from "express";
import {
  get, update,
  getEmailConfig, updateEmailConfig,
  getTelegramConfig, updateTelegramConfig,
} from "./settings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",  get);                     // public — website
router.put("/",  authMiddleware, update);  // protected — dashboard

// Email delivery config — always protected, never exposed publicly.
router.get("/email", authMiddleware, getEmailConfig);
router.put("/email", authMiddleware, updateEmailConfig);

// Telegram notification config — always protected, never exposed publicly.
// GET returns { tokenSet: bool, chatId: string } — token plaintext never sent to client.
// PUT accepts { botToken?, chatId } — blank botToken keeps the stored token.
router.get("/telegram", authMiddleware, getTelegramConfig);
router.put("/telegram", authMiddleware, updateTelegramConfig);

export default router;
