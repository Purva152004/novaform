import jwt from "jsonwebtoken";

const getToken = (req) => {
  const cookieName = process.env.COOKIE_NAME || "ai_forms_token";
  const cookieToken = req.cookies?.[cookieName];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
};

export default function auth(req, res, next) {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}
