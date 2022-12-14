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

const PresentationChart = ({ data, height = 500 }) => {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="80%" height={height}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="des" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="total" fill="#0062e0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PresentationChart;
