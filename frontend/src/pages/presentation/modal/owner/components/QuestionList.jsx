import { CheckCircle, Help, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { SORT_BY_ARR, WS_CMD } from "../../../../../commons/constants";
import { useSocket } from "../../../../../context/socket-context";
import useSort from "../../../../../hooks/useSort";
import { convertTS } from "../../../../../utils/convertTime";
import { iconButton, iconHover } from "./../../../../../commons/globalStyles";

const QuestionList = ({ data }) => {
  const { socketContext } = useSocket();

  const handleUpvote = (questionId) => {
    if (socketContext) {
      socketContext.emit(WS_CMD.UPVOTE_QUESTION_CMD, questionId);
    }
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
  };
  const { setSortBy, sortBy, sortedData } = useSort(data);

  return (
    <Box sx={{ overflow: "scroll" }}>
      {/* Sort dropdown */}
      {data.length > 0 ? (
        <FormControl
          fullWidth
          sx={{ mb: 2, position: "sticky", top: 0, background: "white" }}
        >
          <Select value={sortBy} onChange={handleChange}>
            {SORT_BY_ARR.map((sortType, key) => {
              return (
                <MenuItem key={key} value={sortType.value}>
                  {sortType.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : null}

      {/* Question list */}
      {sortedData.map((item, index) => (
        <Box key={item.id} sx={{ mb: 2 }}>
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
          <Divider orientation="horizontal" flexItem />
        </Box>
      ))}
    </Box>
  );
};

export default QuestionList;
