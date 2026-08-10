import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { uploadImage, deleteImage } from "./upload.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_ROOT = path.join(__dirname, "../../uploads");

// Only allow safe folder names in ?folder= — blocks path traversal (e.g. "../../etc")
const FOLDER_NAME_RE = /^[a-zA-Z0-9_-]+$/;
const MIME_EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const raw = typeof req.query.folder === "string" ? req.query.folder : "general";
    const folder = FOLDER_NAME_RE.test(raw) ? raw : "general";
    req.uploadFolder = folder; // read back in the controller to build the stored relative path

    const dir = path.join(UPLOADS_ROOT, folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Randomised name — never trust the client's original filename
    const ext = MIME_EXT[file.mimetype] || path.extname(file.originalname);
    cb(null, `${crypto.randomBytes(16).toString("hex")}${ext}`);
  },
});

// gif removed — consistent with frontend accept attribute and avoids large animated files
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.post(  "/image", authMiddleware, upload.single("image"), uploadImage);
router.delete("/image", authMiddleware, deleteImage);

export default router;
