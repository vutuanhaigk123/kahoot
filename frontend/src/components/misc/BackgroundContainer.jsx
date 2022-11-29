import React from "react";
import { Box } from "@mui/material";

const BackgroundContainer = ({
  children,
  isWithNavBar = true,
  url = "/SignUp/background.png"
}) => {
  let heightProp = `calc(100vh - 8.3rem)`;
  if (!isWithNavBar) {
    heightProp = `calc(100vh - 4rem)`;
  }
  return (
    <Box
      sx={{
        height: heightProp,
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        p: 4
      }}
      display="flex"
    >
      {children}
    </Box>
  );
};

export default BackgroundContainer;
