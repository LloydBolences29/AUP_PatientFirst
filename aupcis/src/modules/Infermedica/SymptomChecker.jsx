import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Form,
  Badge,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";

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
    { label: "Request", path: "/request" },
  ];

  const getProgress = () => {
    switch (step) {
      case 1:
        return 20;
      case 2:
        return 50;
      case 3:
        return 80;
      case 5:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div>
      <Sidebar
        links={menuLinks}
        pageContent={
          <div className="container">
            <Card className="shadow-sm p-3 mb-3 bg-white rounded text-center">
              <div className="page-content">
                <h1 className="page-title fw-bold text-primary">
                  Symptom Checker
                </h1>
              </div>
            </Card>
            <ProgressBar
              now={getProgress()}
              label={`${getProgress()}%`}
              className="mb-4"
            />
            {step === 1 && !disclaimerAgreed && (
              <Card className="p-4">
                <h2 className="mb-3 text-danger">Disclaimer</h2>
                <p>
                  This symptom checker is powered by AI and is not a substitute
                  for professional medical advice, diagnosis, or treatment. It
                  is intended to provide general information only. Always
                  consult a healthcare professional for medical concerns.
                </p>
                <Form.Check
                  type="checkbox"
                  id="disclaimerCheck"
                  label="I understand and agree to the terms above."
                  checked={disclaimerAgreed}
                  onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                />
              </Card>
            )}

            {step === 1 && disclaimerAgreed && (
              <Card className="p-4">
                <h2 className="mb-3 text-primary">
                  Step 1: Enter Your Information
                </h2>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Age"
                    value={age}
                    isInvalid={!!errors.age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.age}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={sex}
                    isInvalid={!!errors.sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sex}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" onClick={handleNextStep}>
                  Next
                </Button>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-4">
                <h2 className="mb-3 text-primary">Step 2: Select Symptoms</h2>
                <Form.Control
                  type="text"
                  value={symptomQuery}
                  onChange={handleSymptomSearch}
                  placeholder="Search for symptoms"
                  className="mb-3"
                />
                {symptomResult.length > 0 && (
                  <ListGroup
                    className="mb-3"
                    style={{ maxHeight: "150px", overflowY: "scroll" }}
                  >
                    {symptomResult.map((symptomRes) => (
                      <ListGroup.Item
                        key={symptomRes.name}
                        action
                        onClick={() => handleSymptomSelect(symptomRes)}
                      >
                        {symptomRes.name} - {symptomRes.common_name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
                {selectedSymptoms?.length > 0 && (
                  <div className="mt-2">
                    <strong>Selected Symptoms: </strong>
                    <div className="d-flex flex-wrap">
                      {selectedSymptoms.map((symptom) => (
                        <Badge
                          key={symptom.name}
                          bg="primary"
                          className="m-1"
                          style={{ cursor: "pointer" }}
                        >
                          {symptom.name} - {symptom.common_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </Card>
            )}

            {step === 3 && followUpQuestions && (
              <Card className="p-4">
                <h2 className="mb-3 text-primary">
                  Step 3: Answer Follow-up Questions
                </h2>
                <p>{followUpQuestions.text}</p>
                {followUpQuestions?.items?.length > 0 ? (
                  followUpQuestions.items.map((item) => (
                    <div key={item.id} className="mb-2">
                      <strong>{item.name}</strong>
                      {item.choices.map((choice) => (
                        <Form.Check
                          key={choice.id}
                          type="radio"
                          name={`followUp-${item.id}`}
                          label={choice.label}
                          value={choice.id}
                          onChange={() =>
                            handleFollowUpSelect(item.id, choice.id)
                          }
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No follow-up questions available.</p>
                )}
                <Button variant="primary" onClick={handleSubmitFollowUp}>
                  Submit Answer
                </Button>
              </Card>
            )}

            {step === 5 && diagnosis && (
              <Card className="p-4">
                <h2 className="mb-3 text-center text-primary">Diagnosis</h2>
                {diagnosis?.length > 0 ? (
                  <ListGroup>
                    {diagnosis.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span className="fw-bold">{item.common_name}</span>
                        <Badge bg="success">
                          {Math.round(item.probability * 100)}%
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted text-center">
                    No diagnosis available
                  </p>
                )}
              </Card>
            )}
          </div>
        }
      />
    </div>
  );
};

export default SymptomChecker;
