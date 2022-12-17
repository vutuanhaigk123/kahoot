import { Box, Typography } from "@mui/material";
import React from "react";
import { WS_CMD } from "../../../../../commons/constants";
import BasicButton from "../../../../../components/button/BasicButton";
import { useSocket } from "../../../../../context/socket-context";

const CarouselItem = ({ data }) => {
  const { socketContext } = useSocket();
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
      {!data.isAnswered ? (
        <BasicButton
          variant="outlined"
          sx={{ m: "auto", display: "flex" }}
          // icon={
          //   <Check
          //     sx={{ bgcolor: "green", borderRadius: "50%", color: "white" }}
          //   />
          // }
          onClick={() =>
            socketContext.emit(WS_CMD.MARK_QUESTION_ANSWERED_CMD, data.id)
          }
        >
          Marked as answered
        </BasicButton>
      ) : (
        "Answered"
      )}
    </Box>
  );
};

export default CarouselItem;
