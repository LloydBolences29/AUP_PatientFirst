const axios = require("axios");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const interviewId = uuidv4();

// const INFERMEDICA_APP_URL = "https://api.infermedica.com/v3";
const APP_KEY = process.env.INFERMEDICA_APP_KEY; // Store APP key in .env

const infermedicaAPI = axios.create({
  baseURL: "https://api.infermedica.com/v3",
  headers: {
    "App-Id": process.env.INFERMEDICA_APP_ID, // Your Infermedica App ID
    "App-Key": APP_KEY,
    "Content-Type": "application/json",
  },
});

// Function to get symptoms
const getSymptoms = async (ageValue, ageUnit, sex) => {
  try {
    console.log(
      "Inside getSymptoms function - Received age:",
      ageValue,
      "Unit:",
      ageUnit,
      "Sex:",
      sex
    );
    const response = await infermedicaAPI.get("/symptoms", {
      params: {
        sex: sex,
        "age.value": ageValue, // ✅ Ensure correct format
        "age.unit": ageUnit, // ✅ Required unit (year or month)
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching symptoms:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Function to perform diagnosis
const getDiagnosis = async (symptoms, age, sex) => {
  try {
    const formattedAge =
      typeof age === "object" ? age : { value: age, unit: "year" };

    console.log(
      "Sending request to Infermedica API with data:",
      {
        sex: sex,
        age: formattedAge,
        evidence: symptoms,
      },
      {
        headers: {
          "Interview-Id": interviewId,
          "Dev-Mode": "true", // Optional, but useful for testing
        },
      }
    );

    console.log(interviewId)

    const response = await infermedicaAPI.post("/diagnosis", {
      sex: sex,
      age: formattedAge,
      evidence: symptoms,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error performing diagnosis:",
      error.response?.data || error.message
    );
    throw error;
  }
};
const getTriage = async (symptoms, age, sex) => {
    try {
      const response = await infermedicaAPI.post("/triage", {
        sex,
        age,
        evidence: symptoms,
      });
      return response.data;
    } catch (error) {
      console.error("Error performing triage:", error.response?.data || error.message);
      throw error;
    }
  };

module.exports = { getSymptoms, getDiagnosis, getTriage };
