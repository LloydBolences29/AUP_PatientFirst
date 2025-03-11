const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Get token from HTTP-only cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};