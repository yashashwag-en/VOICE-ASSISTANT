import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ ok: true, service: "voice-assistant-backend", ts: Date.now() });
});

export default router;
