import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scoresRoute from "./routes/scores.js";
import playersRoute from "./routes/players.js";
import { connectDB } from "./db/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/scores", scoresRoute);

app.use("/players", playersRoute);

app.delete("/reset", async (req, res) => {
  try {
    const db = await connectDB();
    await db.collection("scores").deleteMany({});
    res.status(200).json({ message: "Data reset" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
