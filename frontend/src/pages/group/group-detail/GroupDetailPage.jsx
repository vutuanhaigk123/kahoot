import { Box } from "@mui/material";
import React from "react";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import MemberList from "./components/member-list-tab/MemberList";

const GroupDetailPage = () => {
  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "60%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <MemberList></MemberList>
      </Box>
    </BackgroundContainer>
  );
};

export default GroupDetailPage;
