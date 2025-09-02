import { connectDB } from "../../libs/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const db = await connectDB();
  try {
    const [rows] = await db.execute(
      "SELECT * FROM schools ORDER BY id DESC"
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch" });
  } finally {
    try { await db.end(); } catch (_) {}
  }
}


