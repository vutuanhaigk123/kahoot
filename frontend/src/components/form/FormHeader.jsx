import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const FormHeader = ({ title, caption }) => {
  return (
    <Box
      align="center"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        mb: 2
      }}
    >
      <Avatar
        src="/pageIcon.png"
        sx={{
          width: "100px",
          height: "100px",
          "& .MuiAvatar-img": {
            objectFit: "scale-down"
          }
        }}
      ></Avatar>
      <Typography variant="h4">{title}</Typography>
      {caption ? <Typography variant="caption">{caption}</Typography> : null}
    </Box>
  );
};

export default FormHeader;
