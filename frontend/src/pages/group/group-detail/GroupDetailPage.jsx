import { Box, Tab } from "@mui/material";
import React from "react";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import usePanel from "./../../../hooks/usePanel";
import MemberList from "./components/member-list-tab/MemberList";
import SlidesList from "./components/slides-tab/SlidesList";

const GroupDetailPage = () => {
  const { value, handleSwitchPanel } = usePanel("1");

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
        {/* Tab panel */}
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider"
            }}
          >
            <TabList
              onChange={handleSwitchPanel}
              aria-label="lab API tabs example"
              // variant="fullWidth"
            >
              <Tab label="Members" value="1" />
              <Tab label="Activities" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <MemberList></MemberList>
          </TabPanel>
          <TabPanel value="2">
            <SlidesList></SlidesList>
          </TabPanel>
        </TabContext>
      </Box>
    </BackgroundContainer>
  );
};

export default GroupDetailPage;
