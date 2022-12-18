import { CheckCircle, Help, ThumbUpOffAlt } from "@mui/icons-material";
import { Box, Divider, Typography, Stack } from "@mui/material";
import React from "react";
import BasicButton from "../../../../../components/button/BasicButton";
import { convertTS } from "../../../../../utils/convertTime";
import { iconButton, iconHover } from "./../../../../../commons/globalStyles";

const QuestionList = ({ data, onClick }) => {
  const handleUpvote = () => {
    console.log("upvoted");
  };

  return (
    <>
      <Typography variant="h4">Question list</Typography>
      {data.map((item, index) => (
        <Box key={item.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            {/* Question */}
            <Stack sx={{ textAlign: "center", justifyContent: "start" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {item.isAnswered ? <CheckCircle color="success" /> : <Help />}
                <Typography variant="h6">{item.content}</Typography>
              </Box>
              <Typography variant="caption">
                {item.name} - {convertTS(item.ts)}
              </Typography>
            </Stack>
            {/* Upvote */}
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
