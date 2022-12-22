import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import PresentationChart from "../../../../../components/chart/PresentationChart";

const MultipleChoiceSlides = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);
  return (
    <>
      <Typography variant="h4">
        {presentation.slides[slideIndex].question}
      </Typography>
      <PresentationChart
        data={presentation.slides[slideIndex].answers}
        height="80%"
      />
    </>
  );
};

export default MultipleChoiceSlides;
