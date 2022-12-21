import { CheckCircle, Help, ThumbUpOffAlt } from "@mui/icons-material";
import { Box, Divider, Typography, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { WS_CMD } from "../../../../../commons/constants";
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
            <Stack sx={{ justifyContent: "start", textAlign: "start" }}>
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
              <Typography variant="caption" color={grey[600]}>
                {item.name} - {convertTS(item.ts)}
              </Typography>
            </Stack>
            {/* Upvote */}
            <Stack>
              <ThumbUpOffAlt
                sx={[
                  iconButton,
                  iconHover(),
                  {
                    bgcolor: item.isVoted ? "primary.main" : null,
                    color: item.isVoted ? "white" : null
                  }
                ]}
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
