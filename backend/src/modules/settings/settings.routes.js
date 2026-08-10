import { Router } from "express";
import { get, update, getEmailConfig, updateEmailConfig } from "./settings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", get);                      // public — website
router.put("/", authMiddleware, update);   // protected — dashboard

// Email delivery config — always protected, never exposed publicly (see
// settings.controller.js's `get`, which explicitly excludes emailConfig).
router.get("/email", authMiddleware, getEmailConfig);
router.put("/email", authMiddleware, updateEmailConfig);

export default router;
