import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({ title, data = [] }) => {
  console.log("📊 Chart Data Received:", data); // Debugging log

  if (!Array.isArray(data)) {
    console.error(
      "❌ Expected 'data' to be an array but got:",
      typeof data,
      data
    );
    data = []; // Fallback to empty array
  }

  return (
    <div className="chart-container">
      <div className="chart-container-wrapper">
        <h3 className="text-center">{title}</h3>
        <div className="chart-content">
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2c3e50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <br />

        
      </div>
    </div>
  );
};

export default CustomBarChart;
