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

const PresentationChart = ({ data }) => {
  return (
    <ResponsiveContainer width="80%" height={600}>
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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="total" fill="#0062e0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PresentationChart;
