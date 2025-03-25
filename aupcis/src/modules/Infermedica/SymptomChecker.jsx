import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import axios from "axios";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/infermedica-api/analyze-symptoms",
        {
          symptoms,
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
    }
    setLoading(false);
  };

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Symptom Checker", path: "/symptomChecker" },
    // { label: "My Profile", path: `/profile/${patient?._id || ""}` }, 

  ];

  return (
    <div>
      <Sidebar
      props = {sidebarLinks}
        pageContent={
          <>
            <div>
              <h2>Symptom Checker</h2>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter your symptoms..."
                rows="4"
                cols="50"
              />
              <button onClick={handleCheckSymptoms} disabled={loading}>
                {loading ? "Checking..." : "Check Symptoms"}
              </button>

              {result && (
                <div>
                  <h3>Results:</h3>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </div>
          </>
        }
      />
    </div>
  );
};

export default SymptomChecker;
