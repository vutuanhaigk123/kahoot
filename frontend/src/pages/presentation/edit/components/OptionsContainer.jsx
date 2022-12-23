import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MultiChoiceOptions from "./edit-type/MultiChoiceOptions";

const OptionsContainer = ({ answers, slideIndex, refetch }) => {
  return (
    <>
      {/* Options */}
      <Box sx={{ display: "flex" }}>
        <Typography variant="h6" fontWeight="bold">
          Options
        </Typography>
      </Box>
      <MultiChoiceOptions />
    </>
  );
};

export default OptionsContainer;
