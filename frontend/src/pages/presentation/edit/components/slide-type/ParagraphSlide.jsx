/* eslint-disable no-unused-vars */
import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const ParagraphSlide = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          overflow: "hidden",
          overflowWrap: "break-word",
          width: "100%",
          textAlign: "center"
        }}
      >
        {presentation.slides[slideIndex].question}
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "start" }}>
        {presentation.slides[slideIndex].paragraph}
      </Typography>
    </>
  );
};

export default ParagraphSlide;
