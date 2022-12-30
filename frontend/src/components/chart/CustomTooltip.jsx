import { Box, Typography } from "@mui/material";
import React from "react";

const CustomTooltip = ({ active, payload, label, canViewModal }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: "white", p: 1, border: 1, borderColor: "black" }}>
        <Typography>{`${label} : ${payload[0].value}`}</Typography>
        {canViewModal ? (
          <Typography variant="subtitle2">Click to view detail</Typography>
        ) : null}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;
