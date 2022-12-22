import { Paper } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import SlideType from "./slide-type/SlideType";

const SlideArea = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);
  return (
    <Paper
      elevation={10}
      sx={{
        height: "60vh",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        p: 2
      }}
    >
      {presentation._id && presentation.slides.length > 0 ? (
        <SlideType slideIndex={slideIndex} />
      ) : null}
    </Paper>
  );
};

export default SlideArea;
