// components/CustomLineChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomLineChart = ({ data, xKey = "date", yKey = "sales", height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke="#2c3e50" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
