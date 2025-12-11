import express from "express";
import { connectDB } from "../db/db.js";

const router = express.Router();

router.post("/addMatch", async (req, res) => {
  try {
    console.log("Match received:", req.body);

    const db = await connectDB();
    const result = await db.collection("scores").insertOne(req.body);

    res.status(200).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Match save error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
