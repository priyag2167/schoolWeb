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

  const isVercel = Boolean(process.env.VERCEL);
  const uploadDir = path.join(process.cwd(), "public", "schoolImages");
  if (!isVercel) {
    await fs.promises.mkdir(uploadDir, { recursive: true });
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

    let imageUrl = "";
    if (isVercel) {
      // On Vercel, the filesystem is read-only. Upload to Vercel Blob instead.
      const fileBuffer = await fs.promises.readFile(tempPath);
      const { url } = await put(`schoolImages/${finalName}`, fileBuffer, {
        access: "public",
        contentType: file.mimetype || undefined,
      });
      imageUrl = url; // absolute URL to the blob
    } else {
      const finalPath = path.join(uploadDir, finalName);
      await fs.promises.copyFile(tempPath, finalPath);
      imageUrl = `/schoolImages/${finalName}`; // served from Next.js public folder in dev
    }

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


