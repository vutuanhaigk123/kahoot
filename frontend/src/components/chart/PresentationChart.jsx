import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const PresentationChart = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <BarChart
      data={data}
      height={400}
      width={800}
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
  );
};

export default PresentationChart;
