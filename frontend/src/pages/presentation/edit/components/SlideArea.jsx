import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import PresentationChart from "../../../../components/chart/PresentationChart";

const dataChart = [
  {
    name: "A",
    total: 1
  },
  {
    name: "B",
    total: 2
  },
  {
    name: "C",
    total: 3
  },
  {
    name: "D",
    total: 4
  }
];

const SlideArea = ({ slideIndex }) => {
  const data = useSelector((state) => state.presentation);

  return (
    <Paper
      elevation={10}
      sx={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        p: 2
      }}
    >
      <Typography variant="h4">
        {data._id ? data.slides[slideIndex].question : null}
      </Typography>
      <PresentationChart data={data._id ? data.slides.answers : null} />
    </Paper>
  );
};

export default SlideArea;
