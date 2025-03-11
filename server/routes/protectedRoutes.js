const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/protected-data", authMiddleware, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});

module.exports = router;