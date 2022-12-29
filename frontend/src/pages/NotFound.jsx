import React from "react";
import { Paper, Typography } from "@mui/material";
import BackgroundContainer from "./../components/misc/BackgroundContainer";
import Empty from "./group/components/Empty";

const NotFound = () => {
  return (
    <BackgroundContainer>
      <Paper
        elevation={10}
        sx={{ m: "auto", p: 4, width: "50vw", textAlign: "center" }}
      >
        <Empty img="/Error/404.png"></Empty>
        <Typography variant="h2">404 Not Found</Typography>
      </Paper>
    </BackgroundContainer>
  );
};

export default NotFound;
