import { Check } from "@mui/icons-material";
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
        textAlign: "center",
        mt: 1,
        mb: 2
      }}
    >
      {/* Questions */}
      <Box textAlign="center">
        <Typography variant="h6" sx={{ flexWrap: "wrap" }}>
          Asked by: <span style={{ fontWeight: "bold" }}>{data.name}</span>
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {data.content}
        </Typography>
      </Box>

      {/* Mark as answered */}
      <BasicButton
        sx={{
          m: "auto",
          display: "flex"
        }}
        disabled={data.isAnswered}
        icon={
          data.isAnswered ? (
            <Check
              sx={{
                bgcolor: "success.light",
                borderRadius: "50%",
                color: "white"
              }}
            />
          ) : null
        }
        onClick={() =>
          socketContext.emit(WS_CMD.MARK_QUESTION_ANSWERED_CMD, data.id)
        }
      >
        {data.isAnswered ? "Answered" : "Marked as answered"}
      </BasicButton>
    </Box>
  );
};

export default CarouselItem;
