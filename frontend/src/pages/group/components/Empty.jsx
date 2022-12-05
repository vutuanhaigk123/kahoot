import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

const Empty = ({ children, img = "/Groups/Empty.png" }) => {
  return (
    <Stack sx={{ textAlign: "center" }}>
      <Typography variant="h4">{children}</Typography>
      <Box
        component="img"
        sx={{ height: 300, objectFit: "scale-down" }}
        src={img}
        alt="empty"
      ></Box>
    </Stack>
  );
};

export default Empty;
