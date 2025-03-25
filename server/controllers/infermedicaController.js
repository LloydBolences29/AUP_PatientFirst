const express = require("express");
const router = express.Router();
const axios = require("axios");
const Patient = require("../model/Patient")
const mongoose = require ("mongoose")

const INFERMEDICA_BASE_URL = process.env.INFERMEDICA_BASE_URL;
const APP_ID = process.env.INFERMEDICA_APP_ID;
const APP_KEY = process.env.INFERMEDICA_APP_KEY;

//get patient data
const get_infermedica = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const response = await axios.get(
      `${INFERMEDICA_BASE_URL}/patients/${patient_id}`,
      {
        headers: {
          Authorization: `Bearer ${APP_KEY}`,
          "App-Id": APP_ID,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
};

//Create a Patient
const post_infermedica = async (req, res) => {
  try {
    const response = await axios.post(
      `${INFERMEDICA_BASE_URL}/patients`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${APP_KEY}`,
          "App-Id": APP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
};

//Start a Symptom Analysis (Diagnosis)
const analyzeSymptom = async (req, res) =>{
  try {
    const { patientId, symptoms } = req.body; // Get patientId and symptoms from request

    // 🔹 Step 1: Fetch patient details from your database
    const patient = await Patient.findById(patient_id);  // Assuming Mongoose
    if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
    }

    // 🔹 Step 2: Prepare the API request with patient's data
    const requestData = {
        sex: patient.gender,  // Use gender from database
        age: patient.age,     // Use age from database
        evidence: symptoms    // Use symptoms from request body
    };

    const response = await axios.post(`${INFERMEDICA_BASE_URL}/diagnosis`, req.body, {
        headers: {
            "Authorization": `Bearer ${APP_KEY}`,
            "App-Id": APP_ID,
            "Content-Type": "application/json"
        }
    });
    res.json(response.data);
} catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: "Server error" });
}

}

module.exports = { get_infermedica, post_infermedica, analyzeSymptom };
