import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const PresentationChart = ({ data, height = 500, width = "80%" }) => {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="des" />
        <YAxis width={40} />
        <Tooltip />

        <Bar dataKey="total" fill="#0062e0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PresentationChart;
