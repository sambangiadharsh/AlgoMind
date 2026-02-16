import express from "express";
import { askDSA } from "../controllers/ragService.js";

const router = express.Router();

router.post("/dsa-chat", async (req, res) => {
  try {
    const { message } = req.body;

    const answer = await askDSA(message);

    res.json({ reply: answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
