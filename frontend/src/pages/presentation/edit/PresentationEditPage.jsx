import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import EditArea from "./components/EditArea";
import SideBar from "./components/SideBar";
import SlideArea from "./components/SlideArea";
import { useQuery } from "react-query";
import { handleGet } from "../../../utils/fetch";
import { API } from "../../../commons/constants";
import Loading from "./../../../components/Loading";
import { useDispatch } from "react-redux";
import { set } from "../../../redux-toolkit/presentationSlice";

const PresentationEditPage = () => {
  const { id: presentationId } = useParams();

  const { isLoading, error, data, refetch } = useQuery(
    "presentaion-detail",
    () => handleGet(API.PRESENTATION_LIST + `/${presentationId}`)
  );
  console.log(
    "🚀 ~ file: PresentationEditPage.jsx:35 ~ PresentationEditPage ~ data",
    data
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (data?.status === 0) {
      dispatch(set(data.info));
    }
  });

  const [slideIndex, setSlideIndex] = React.useState(0);
  console.log(
    "🚀 ~ file: PresentationEditPage.jsx:35 ~ PresentationEditPage ~ slideIndex",
    slideIndex
  );

  if (error) return "An error has occurred: " + error.message;

  if (isLoading) return <Loading />;

  return (
    <BackgroundContainer>
      <Box sx={{ width: "90%", m: "auto" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {data?.info.title}
        </Typography>
        <Grid container spacing={6}>
          {/* Left side bar */}
          <Grid item xs={2}>
            <SideBar
              refetch={refetch}
              slideIndex={slideIndex}
              setSlideIndex={setSlideIndex}
            ></SideBar>
          </Grid>
          {/* Slide area */}
          <Grid item xs={7}>
            <SlideArea slideIndex={slideIndex}></SlideArea>
          </Grid>
          {/* Edit option area */}
          <Grid item xs={3}>
            <EditArea slideIndex={slideIndex} refetch={refetch}></EditArea>
          </Grid>
        </Grid>
      </Box>
    </BackgroundContainer>
  );
};

export default PresentationEditPage;
