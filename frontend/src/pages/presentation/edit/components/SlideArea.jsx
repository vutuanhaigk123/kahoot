import { Paper, Typography } from "@mui/material";
import React from "react";
import PresentationChart from "../../../../components/chart/PresentationChart";

const SlideArea = ({ data }) => {
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
      <Typography variant="h4">Câu hỏi</Typography>
      <PresentationChart data={data} />
    </Paper>
  );
};

export default SlideArea;
