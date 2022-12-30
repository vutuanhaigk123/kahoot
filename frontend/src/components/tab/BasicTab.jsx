import React from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";

const tab = [
  { label: "Owned group", value: "1" },
  { label: "Joined group", value: "2" }
];

const BasicTab = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          {tab?.map((item) => (
            <Tab label={item.label} value={item.value} />
          ))}
        </TabList>
      </Box>
      {tab?.map((item) => (
        <TabPanel value={item.value}></TabPanel>
      ))}
    </TabContext>
  );
};

export default BasicTab;
