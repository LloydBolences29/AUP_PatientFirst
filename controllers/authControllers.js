const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup (Register)
const signup = async (req, res) => {
  try {
    const { patient_ID, password, role } = req.body;

    const existingUser = await User.findOne({ patient_ID });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ patient_ID, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// ✅ Login (Set JWT in HTTP-only Cookie)
const login = async (req, res) => {
  try {
    //gets the patient_ID and password from the request body
    const { patient_ID, password } = req.body;

    //finds the user with the patient_ID and return the message "User not found" if the user is not found
    const user = await User.findOne({ patient_ID });
    if (!user) return res.status(400).json({ message: "User not found" });

    //compares the password with the hashed password in the database and return the message "Invalid credentials" if the password is incorrect
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });


    //creates a token with the patient_ID and role and sets the token in a HTTP-only cookie
    const token = jwt.sign(
      { patient_ID: user.patient_ID, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    //sets the token in a HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// ✅ Logout (Clear Cookie)
// exports.logout = (req, res) => {
//   res.clearCookie("token");
//   res.json({ message: "Logged out successfully" });
// };

module.exports = { signup, login };
