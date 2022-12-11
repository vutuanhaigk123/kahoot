import { QuestionMark } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import BasicButton from "../../../../../components/button/BasicButton";

const QuestionList = ({ data, onClick }) => {
  return (
    <>
      <Typography variant="h4">Question list</Typography>
      {data.map((item, index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <QuestionMark />
            {/* <Check /> */}
            <Typography variant="h6">{item.question}</Typography>
          </Box>
          <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
        </Box>
      ))}
      <BasicButton onClick={onClick}>Ask a new question</BasicButton>
    </>
  );
};

export default QuestionList;
