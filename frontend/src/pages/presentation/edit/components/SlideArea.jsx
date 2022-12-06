import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import PresentationChart from "../../../../components/chart/PresentationChart";

const SlideArea = ({ slideIndex }) => {
  const data = useSelector((state) => state.presentation);

  return (
    <Paper
      elevation={10}
      sx={{
        height: "100%",
        minHeight: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        p: 2
      }}
    >
      {data._id && data.slides.length > 0 ? (
        <>
          <Typography variant="h4">
            {data.slides[slideIndex].question}
          </Typography>
          <PresentationChart data={data.slides[slideIndex].answers} />
        </>
      ) : null}
    </Paper>
  );
};

export default SlideArea;
