import React from "react";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import { Box } from "@mui/material";
import BasicTab from "../../components/tab/BasicTab";
import JoinedGroup from "./components/JoinedGroup";
import CreatedGroup from "./components/CreatedGroup";

const panelList = [
  {
    label: "Owned group",
    component: <CreatedGroup />
  },
  {
    label: "Joined group",
    component: <JoinedGroup />
  }
];

const GroupPage = () => {
  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "40%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <BasicTab panelList={panelList} />
      </Box>
    </BackgroundContainer>
  );
};

export default GroupPage;
