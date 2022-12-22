import { AddCircle, Close, Edit, SaveAs } from "@mui/icons-material";
import { Typography, CircularProgress, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";
import MultiChoiceOptions from "./options/MultiChoiceOptions";

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
