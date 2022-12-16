import { Box, Typography } from "@mui/material";
import React from "react";
import BasicButton from "../../../../../components/button/BasicButton";

const CarouselItem = ({ data }) => {
  console.log(data);
  return (
    <Box
      textAlign="center"
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        textAlign: "center"
      }}
    >
      {/* Questions */}
      <Box textAlign="center">
        <Typography variant="h6">
          Asked by: <span style={{ fontWeight: "bold" }}>{data.name}</span>
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {data.content}
        </Typography>
      </Box>

      {/* Mark as answered */}
      <BasicButton
        variant="outlined"
        sx={{ m: "auto", display: "flex" }}
        // icon={
        //   <Check
        //     sx={{ bgcolor: "green", borderRadius: "50%", color: "white" }}
        //   />
        // }
        onClick={() => console.log("answered")}
      >
        Marked as answered
      </BasicButton>
    </Box>
  );
};

export default CarouselItem;
