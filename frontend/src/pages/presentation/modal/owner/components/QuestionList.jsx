import { QuestionMark, ThumbUpOffAlt } from "@mui/icons-material";
import { Box, Divider, Typography, Stack } from "@mui/material";
import React from "react";
import BasicButton from "../../../../../components/button/BasicButton";
import { iconButton, iconHover } from "./../../../../../commons/globalStyles";

const QuestionList = ({ data, onClick }) => {
  console.log("🚀 ~ file: QuestionList.jsx:8 ~ QuestionList ~ data", data);
  const handleUpvote = () => {
    console.log("upvoted");
  };

  return (
    <>
      <Typography variant="h4">Question list</Typography>
      {data.map((item, index) => (
        <Box key={index}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <QuestionMark />
              {/* <Check /> */}
              <Typography variant="h6">{item.question}</Typography>
            </Box>
            <Stack>
              <ThumbUpOffAlt
                sx={[iconButton, iconHover()]}
                onClick={handleUpvote}
              />
              {5}
            </Stack>
          </Box>
          <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
        </Box>
      ))}
      <BasicButton onClick={onClick}>Ask a new question</BasicButton>
    </>
  );
};

export default QuestionList;
