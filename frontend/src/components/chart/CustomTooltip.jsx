import { Box, Typography } from "@mui/material";
import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: "white", p: 1, border: 1, borderColor: "black" }}>
        <Typography>{`${label} : ${payload[0].value}`}</Typography>
        {payload[0].payload.userInfo &&
          payload[0].payload.userInfo.map((item) => (
            <Typography>{`${item.name} : ${item.time}`}</Typography>
          ))}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;
