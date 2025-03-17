const Staff = require('../model/User')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;

const loginStaff = async (req, res) => {
    try {
      const { role_ID, password } = req.body;
      console.log("role id: ", role_ID)
      console.log("Password: ", password)
  
      const staff = await Staff.findOne({ role_ID }); // Query from 'Staff' collection
      if (!staff) return res.status(400).json({ message: "Staff not found" });
  
      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ staff_id: staff.role_ID, role: staff.role }, JWT_SECRET, { expiresIn: "1h" });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "Strict",
      });
  
      res.json({ message: "Login successful", role_ID: staff.role_ID, role: staff.role, token });
      console.log(req.body)

    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  module.exports = {loginStaff}