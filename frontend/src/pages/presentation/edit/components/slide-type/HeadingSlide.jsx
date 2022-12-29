/* eslint-disable no-unused-vars */
import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const HeadingSlide = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          overflow: "hidden",
          overflowWrap: "break-word",
          width: "100%",
          textAlign: "center",
          wordWrap: "break-all"
        }}
      >
        {presentation.slides[slideIndex].question}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          overflow: "hidden",
          overflowWrap: "break-word",
          width: "100%",
          textAlign: "center"
        }}
      >
        {presentation.slides[slideIndex].heading}
      </Typography>
    </>
  );
};

export default HeadingSlide;
