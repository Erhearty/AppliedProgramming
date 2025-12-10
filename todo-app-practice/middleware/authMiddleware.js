import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Немає токена" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId всередині
    next();
  } catch (err) {
    return res.status(403).json({ error: "Невірний токен" });
  }
}
