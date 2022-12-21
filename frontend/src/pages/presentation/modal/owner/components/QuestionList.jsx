import { CheckCircle, Help, ThumbUpOffAlt } from "@mui/icons-material";
import { Box, Divider, Typography, Stack } from "@mui/material";
import React from "react";
import { WS_CMD, WS_EVENT } from "../../../../../commons/constants";
import BasicButton from "../../../../../components/button/BasicButton";
import { useSocket } from "../../../../../context/socket-context";
import { convertTS } from "../../../../../utils/convertTime";
import { iconButton, iconHover } from "./../../../../../commons/globalStyles";

const QuestionList = ({ data, onClick }) => {
  const { socketContext } = useSocket();

  const handleUpvote = (questionId) => {
    if (socketContext) {
      socketContext.emit(WS_CMD.UPVOTE_QUESTION_CMD, questionId);
    }
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
                onClick={() => {
                  if (!item.isVoted) handleUpvote(item.id);
                }}
              />
              {item.upVotes && item.upVotes > 0 ? item.upVotes : ""}
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
