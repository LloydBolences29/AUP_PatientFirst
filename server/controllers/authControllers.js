const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Signup (Register)
exports.signup = async (req, res) => {
  try {
    const { patient_ID, password, role } = req.body;

    const existingUser = await User.findOne({ patient_ID });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ patient_ID, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// ✅ Login (Set JWT in HTTP-only Cookie)
exports.login = async (req, res) => {
  try {
    const { patient_ID, password } = req.body;

    const user = await User.findOne({ patient_ID });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ patient_ID: user.patient_ID, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// ✅ Logout (Clear Cookie)
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};