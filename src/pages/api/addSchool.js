import formidable from "formidable";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { connectDB } from "@/libs/db";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const form = formidable({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => {
        if (err) return reject(err);
        return resolve({ fields: flds, files: fls });
      });
    });

    const name = String(fields.name || "").trim();
    const email_id = String(fields.email_id || "").trim();
    const contact = String(fields.contact || "").trim();
    const address = String(fields.address || "").trim();
    const city = String(fields.city || "").trim();
    const state = String(fields.state || "").trim();


    const fileField = files.image;
    if (!fileField) return res.status(400).json({ success: false, message: "Image is required" });
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    const tempPath = file.filepath || file.path;
    const ext = (path.extname(file.originalFilename || "") || ".png").toLowerCase();
    const finalName = `school-${Date.now()}${ext}`;

    // Upload to Vercel Blob (public)
    const blob = await put(`schoolImages/${finalName}`,
      fs.createReadStream(tempPath),
      {
        access: "public",
        contentType: file.mimetype || "application/octet-stream",
      }
    );
    const imageUrl = blob.url;

    const db = await connectDB();
    try {
      const [result] = await db.execute(
        `INSERT INTO schools (name, address, city, state, contact, image, email_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, contact, imageUrl, email_id]
      );

      return res.status(201).json({ success: true, id: result.insertId, imageUrl });
    } finally {
      try { await db.end(); } catch (_) {}
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Upload failed" });
  }
}


