import OwnedPresentation from "./components/OwnedPresentation";
import { TabContext, TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import usePanel from "./../../../hooks/usePanel";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import ColabPresentation from "./components/ColabPresentation";

const panelList = [
  {
    label: "Owned presentation",
    component: <OwnedPresentation></OwnedPresentation>
  },
  {
    label: "Colab presentation",
    component: <ColabPresentation></ColabPresentation>
  }
];

const PresentationListPage = () => {
  const { value, handleSwitchPanel } = usePanel(panelList[0].label);

  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "70%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleSwitchPanel}
              aria-label="lab API tabs example"
            >
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
      </Box>
    </BackgroundContainer>
  );
};

export default PresentationListPage;
