const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

//to check if the token sent by the client in login is valid or not. 
// if valid, authenticate user, if not send error messages. 
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" , token 

  });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.user = decoded; // { patient_ID, role }
    next();

    //this is to check if the role of the user is included in the array of roles from the roleMiddleware
  });
  
}

module.exports = authMiddleware;

