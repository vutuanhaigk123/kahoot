import { Box, Typography } from "@mui/material";
import React from "react";
import { questionType } from "../../../commons/constants";
import PresentationChart from "../../../components/chart/PresentationChart";

const PresentationType = ({
  curQuesType,
  data,
  question,
  userShortInfoList,
  canViewModal
}) => {
  switch (curQuesType) {
    case questionType.MULTIPLE_CHOICE:
      if (data.length > 0) {
        return (
          <PresentationChart
            userShortInfoList={userShortInfoList}
            data={data}
            height="100%"
            width="90%"
            canViewModal={canViewModal}
          />
        );
      } else {
        return (
          <Typography variant="h2" sx={{ m: "auto" }}>
            There is no answers yet
          </Typography>
        );
      }
    case questionType.HEADING:
      return (
        <Box sx={{ m: "auto" }}>
          <Typography
            variant="h2"
            sx={{
              overflow: "hidden",
              overflowWrap: "break-word",
              width: "100%",
              textAlign: "center",
              wordWrap: "break-all"
            }}
          >
            {question}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              overflow: "hidden",
              overflowWrap: "break-word",
              width: "100%",
              textAlign: "center"
            }}
          >
            {data}
          </Typography>
        </Box>
      );
    case questionType.PARAGRAPH:
      return (
        <Box sx={{ m: "auto" }}>
          <Typography
            variant="h2"
            sx={{
              overflow: "hidden",
              overflowWrap: "break-word",
              width: "100%",
              textAlign: "center"
            }}
          >
            {question}
          </Typography>
          <Typography variant="h6" sx={{ textAlign: "start" }}>
            {data}
          </Typography>
        </Box>
      );

    default:
      return;
  }
};

export default PresentationType;
