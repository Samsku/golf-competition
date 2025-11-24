import express from "express";
import { connectDB } from "../db/db.js";

const router = express.Router();

router.post("/addPlayer", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("players").insertOne(req.body);
    res.status(200).json({ insertedId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/players", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("players").find({}).toArray();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
