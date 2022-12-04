import { Box, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import BackgroundContainer from "./../../../components/misc/BackgroundContainer";
import EditArea from "./components/EditArea";
import SideBar from "./components/SideBar";
import SlideArea from "./components/SlideArea";

const dataChart = [
  {
    name: "A",
    total: 1
  },
  {
    name: "B",
    total: 2
  },
  {
    name: "C",
    total: 3
  },
  {
    name: "D",
    total: 4
  }
];

const SlidesEditPage = () => {
  const { id: slideId } = useParams();
  const [data, setData] = React.useState(dataChart);
  return (
    <BackgroundContainer>
      <Box sx={{ width: "90%", height: "100%", m: "auto" }}>
        <Grid container spacing={6}>
          {/* Left side bar */}
          <Grid item xs={2}>
            {/* Side bar container */}
            <SideBar></SideBar>
          </Grid>
          {/* Slide area */}
          <Grid item xs={8}>
            <SlideArea data={data}></SlideArea>
          </Grid>
          {/* Edit option area */}
          <Grid item xs={2}>
            <EditArea></EditArea>
          </Grid>
        </Grid>
      </Box>
    </BackgroundContainer>
  );
};

export default SlidesEditPage;
