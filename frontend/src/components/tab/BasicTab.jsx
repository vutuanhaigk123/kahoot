import React from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import usePanel from "../../hooks/usePanel";

const BasicTab = ({ panelList }) => {
  const { value, handleSwitchPanel } = usePanel(panelList[0].label);

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleSwitchPanel} aria-label="lab API tabs example">
          {panelList.map((item) => (
            <Tab key={item.label} label={item.label} value={item.label} />
          ))}
        </TabList>
      </Box>
      {panelList.map((item) => (
        <TabPanel
          key={item.label}
          value={item.label}
          sx={{
            p: 0
          }}
        >
          {item.component}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default BasicTab;
