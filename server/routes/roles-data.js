const express = require("express");
const router = express.Router();  // Use router if this is a route file
const newUserRole = require("../model/User");  // Import model

router.post("/user", async (req, res) => {
    try {
        const { role_ID, password, fullName, address, city, role, zip } = req.body;

        // Validate required fields
        if (!role_ID || !password || !fullName || !address || !city || !role || !zip) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new user
        const newPatient = new newUserRole(req.body);
        await newPatient.save();

        res.status(201).json({ message: "User added successfully", user: newPatient });

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error saving user", error });
    }
});

// Export the router if this is a route file
module.exports = router;