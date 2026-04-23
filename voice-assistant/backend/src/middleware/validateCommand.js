export const validateCommand = (req, res, next) => {
  const { text } = req.body || {};

  if (typeof text !== "string") {
    return res.status(400).json({ error: "text must be a string." });
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return res.status(400).json({ error: "text is required." });
  }

  if (trimmed.length > 300) {
    return res.status(400).json({ error: "text exceeds max length (300)." });
  }

  req.body.text = trimmed;
  next();
};
