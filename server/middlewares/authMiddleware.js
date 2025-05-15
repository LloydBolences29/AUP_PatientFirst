const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

//to check if the token sent by the client in login is valid or not. 
// if valid, authenticate user, if not send error messages. 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("🔴 JWT verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = decoded; // token payload (e.g., { id, role })
    console.log("✅ Authenticated User:", req.user);
    next();
  });
};


module.exports = authMiddleware;

