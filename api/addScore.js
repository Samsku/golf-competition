import { connectDB } from "../backend/db/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const db = await connectDB();
  const result = await db.collection("scores").insertOne(req.body);

  res.status(200).json(result);
}
