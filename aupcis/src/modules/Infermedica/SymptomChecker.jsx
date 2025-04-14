import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ageUnit, setAgeUnit] = useState("year");
  const [symptoms, setSymptoms] = useState([]);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [patientId, setPatientId] = useState(null); // Store patient ID from JWT
  const [loading, setLoading] = useState(true);
  const [symptomResult, setSymptomResult] = useState([]);
  const [symptomQuery, setSymptomQuery] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState([]);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // State to track validation errors
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false); // Track disclaimer agreement

  const validateStep1 = () => {
    const newErrors = {};
    if (!age || isNaN(age) || age <= 0) {
      newErrors.age = "Please enter a valid age.";
    }
    if (!sex) {
      newErrors.sex = "Please select your sex.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return false;
    }
    return true;
  };

  // Symptom Search Handler
  const handleSymptomSearch = async (e) => {
    const query = e.target.value;
    setSymptomQuery(query);

    // Search when query length is greater than 1
    if (query.length > 1) {
      try {
        const response = await axios.get(
          `https://localhost:3000/infermedica-api/symptom/search?q=${query}`
        );
        setSymptomResult(response.data.slice(0, 30)); // ✅ Limit results
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    } else {
      setSymptomResult([]);
    }
  };

  // Symptom Select Handler
  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms?.some((selected) => selected.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSymptomQuery("");
    setSymptomResult([]);
  };

  // Fetch Symptoms Based on Age and Sex
  const fetchSymptoms = async () => {
    try {
      const response = await axios.get(
        "https://localhost:3000/infermedica-api/symptoms",
        {
          params: { age, sex },
        }
      );
      setSymptoms(response.data.slice(0, 50)); // ✅ Store only 50 symptoms
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  // Get Follow-Up Questions from Infermedica
  const getFollowUpQuestions = async () => {
    try {
      // Ensure `evidence` is properly formatted
      const formattedEvidence = selectedSymptoms
        .slice(0, 10)
        .map((symptom) => ({
          id: symptom.id, // Only keep the symptom ID
          choice_id: "present", // Default choice ID, you can change later if needed
        }));

      const response = await axios.post(
        "https://localhost:3000/infermedica-api/diagnose",
        {
          evidence: formattedEvidence,
          age: { value: age, unit: "year" },
          sex,
        }
      );

      if (response.data.question) {
        setFollowUpQuestions(response.data.question);
      }

      if (response.data.conditions.length > 0) {
        setDiagnosis(response.data.conditions);
      }
    } catch (error) {
      console.error("Error fetching follow-up questions:", error);
    }
  };

  // Handle Submit for Follow-Up
  const handleSubmitFollowUp = async () => {
    try {
      const updatedEvidence = [
        ...selectedSymptoms.slice(0, 10).map((symptom, index) => ({
          id: symptom.id,
          choice_id: "present",
          source: index === 0 ? "initial" : undefined,
        })),
        ...selectedFollowUp, // Include answers to follow-up questions
      ];

      const response = await axios.post(
        "https://localhost:3000/infermedica-api/diagnose",
        {
          evidence: updatedEvidence,
          age: { value: age, unit: "year" },
          sex,
        }
      );

      console.log("Follow-up Response:", response.data);

      if (response.data.should_stop) {
        setDiagnosis(response.data.conditions || []); // ✅ Store conditions or empty array
        setStep(5); // Move to the diagnosis step
      } else {
        setFollowUpQuestions(response.data.question || []);
      }
    } catch (error) {
      console.error("Error submitting follow-up:", error);
      alert("An error occurred while submitting follow-up.");
    }
  };

  // Final Submit for Diagnosis
  const handleSubmit = async () => {
    if (!age || !sex) {
      alert("Please provide both age and sex.");
      return;
    }

    try {
      const formattedEvidence = selectedSymptoms.map((symptom, index) => ({
        id: symptom.id,
        choice_id: "present",
        source: index === 0 ? "initial" : undefined, // Mark first symptom as initial
      }));

      const requestData = {
        sex,
        age: { value: parseInt(age), unit: "year" },
        evidence: formattedEvidence,
      };

      console.log("Sending request:", requestData);

      const response = await axios.post(
        "https://localhost:3000/infermedica-api/diagnose",
        requestData
      );

      console.log("Diagnosis Response:", response.data);

      if (response.data.conditions?.length > 0) {
        setDiagnosis(response.data.conditions);
        console.log("Updated Diagnosis State:", response.data.conditions);
        // ✅ Store only conditions
      } else {
        setDiagnosis([]); // No conditions found
      }

      setStep(5); // Move to the diagnosis step
    } catch (error) {
      console.error(
        "Error getting diagnosis:",
        error.response?.data || error.message
      );
      alert("An error occurred while fetching the diagnosis.");
    }
  };

  // Step Navigation
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      fetchSymptoms();
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      getFollowUpQuestions();
      setStep(3);
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const handleFollowUpSelect = (questionId, choiceId) => {
    setSelectedFollowUp((prev) => [
      ...prev.filter((q) => q.id !== questionId), // Remove previous answer for the same question
      { id: questionId, choice_id: choiceId },
    ]);
  };
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3000/patientname/auth/me",
          {
            withCredentials: true, // ✅ Ensures cookies are sent
          }
        );

        console.log("Received Patient ID from Backend:", response.data.id);
        setPatientId(response.data.id);
      } catch (err) {
        console.error("Error fetching patient ID:", err);
        setError("Failed to retrieve patient ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientId();
  }, []);
  const menuLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    { label: "My Profile", path: `/profile/${patientId || ""}` },
  ];

  return (
    <div>
      <Sidebar
        links={menuLinks}
        pageContent={
          <div className="container mt-4">
            {step === 1 && !disclaimerAgreed && (
              <div className="card p-4">
                <h2 className="mb-3">Disclaimer</h2>
                <p>
                  This symptom checker is powered by AI and is not a substitute for professional medical advice, diagnosis, or treatment. 
                  It is intended to provide general information only. Always consult a healthcare professional for medical concerns.
                </p>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="disclaimerCheck"
                    checked={disclaimerAgreed}
                    onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="disclaimerCheck">
                    I understand and agree to the terms above.
                  </label>
                </div>
                {/* <button
                  className="btn btn-primary mt-3"
                  disabled={!disclaimerAgreed} // Button is disabled until checkbox is checked
                  onClick={() => setStep(1)}
                >
                  Proceed
                </button> */}
              </div>
            )}

            {step === 1 && disclaimerAgreed && (
              <div className="card p-4">
                <h2 className="mb-3">Step 1: Enter Your Information</h2>
                <div className="mb-3">
                  <input
                    type="number"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>
                <div className="mb-3">
                  <select
                    className={`form-select ${errors.sex ? "is-invalid" : ""}`}
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
                </div>
                <button className="btn btn-primary" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-4">
                <h2 className="mb-3">Step 2: Select Symptoms</h2>
                <input
                  type="text"
                  value={symptomQuery}
                  onChange={handleSymptomSearch}
                  placeholder="Search for symptoms"
                  className="form-control"
                />
                {symptomResult.length > 0 && (
                  <ul
                    className="list-group"
                    style={{
                      maxHeight: "150px",
                      overflowY: "scroll",
                      cursor: "pointer",
                    }}
                  >
                    {symptomResult.map((symptomRes) => (
                      <li
                        key={symptomRes.name}
                        className="list-group-item"
                        onClick={() => handleSymptomSelect(symptomRes)}
                      >
                        {symptomRes.name} - {symptomRes.common_name}
                      </li>
                    ))}
                  </ul>
                )}

                {selectedSymptoms?.length > 0 && (
                  <div className="mt-2">
                    <strong>Selected Symptoms: </strong>
                    <div className="d-flex flex-wrap">
                      {selectedSymptoms.map((symptom) => (
                        <span
                          key={symptom.name}
                          className="badge bg-primary m-1"
                          style={{ cursor: "pointer" }}
                        >
                          {symptom.name} - {symptom.common_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary mt-3"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            )}

            {step === 3 && followUpQuestions && (
              <div className="card p-4">
                <h2 className="mb-3">Step 3: Answer Follow-up Questions</h2>
                <p>{followUpQuestions.text}</p>

                {followUpQuestions?.items?.length > 0 ? (
                  followUpQuestions.items.map((item) => (
                    <div key={item.id} className="mb-2">
                      <strong>{item.name}</strong>
                      {item.choices.map((choice) => (
                        <div key={choice.id} className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name={`followUp-${item.id}`} // Unique name per question
                            value={choice.id}
                            onChange={() =>
                              handleFollowUpSelect(item.id, choice.id)
                            }
                          />
                          <label className="form-check-label">
                            {choice.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No follow-up questions available.</p>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handleSubmitFollowUp}
                >
                  Submit Answer
                </button>
              </div>
            )}

            {/* Showing diagnosis */}
            {step === 5 && diagnosis && (
              <div className="card p-4">
                <h2 className="mb-3 text-center text-primary">Diagnosis</h2>
                {diagnosis?.length > 0 ? (
                  <ul className="list-group">
                    {diagnosis.map((item) => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{item.common_name}</span>
                        <span className="badge bg-success">{Math.round(item.probability * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted text-center">No diagnosis available</p>
                )}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default SymptomChecker;
