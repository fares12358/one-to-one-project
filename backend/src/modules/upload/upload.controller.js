import path from "path";
import fs from "fs";
import { UPLOADS_ROOT } from "./upload.routes.js";

// ─── POST /api/upload/image  (protected) ──────────────────────────────────────
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // publicId doubles as the "<folder>/<filename>" relative path used to delete later
    const publicId = `${req.uploadFolder}/${req.file.filename}`;
    const url = `${req.protocol}://${req.get("host")}/uploads/${publicId}`;

    res.json({
      success: true,
      data: { url, publicId },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/upload/image  (protected) ────────────────────────────────────
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    const relative = String(publicId).trim();
    const filePath = path.join(UPLOADS_ROOT, relative);

    // Guard against path traversal — resolved path must stay inside UPLOADS_ROOT
    if (relative.includes("..") || path.isAbsolute(relative) || !filePath.startsWith(UPLOADS_ROOT)) {
      return res.status(400).json({ success: false, message: "Invalid publicId" });
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") throw err; // already gone — treat as success
    }

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
