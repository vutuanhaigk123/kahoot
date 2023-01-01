import { Box, Grid } from "@mui/material";
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
import { clear, set } from "../../../redux-toolkit/presentationSlice";
import TitleArea from "./components/TitleArea";
import NotFound from "../../NotFound";

const PresentationEditPage = () => {
  const { id: presentationId } = useParams();

  const { isLoading, error, data, refetch } = useQuery(
    "presentaion-detail",
    () => handleGet(API.PRESENTATION_LIST + `/${presentationId}`)
  );

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (data?.status === 0) {
      dispatch(set(data.info));
    }
    return () => dispatch(clear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const [slideIndex, setSlideIndex] = React.useState(0);

  if (error) return "An error has occurred: " + error.message;

  if (!data?.info && !isLoading) return <NotFound />;

  return (
    <BackgroundContainer>
      <Box sx={{ width: "90vw", m: "auto" }}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Title */}
            <TitleArea
              refetch={refetch}
              slideIndex={slideIndex}
              wrap="nowrap"
            ></TitleArea>
            <Grid container columnSpacing={{ xs: 2 }}>
              {/* Left side bar */}
              <Grid item xs={2}>
                <SideBar
                  refetch={refetch}
                  slideIndex={slideIndex}
                  setSlideIndex={setSlideIndex}
                ></SideBar>
              </Grid>
              {/* Slide area */}
              <Grid item xs={true}>
                <SlideArea slideIndex={slideIndex}></SlideArea>
              </Grid>
              {/* Edit option area */}
              <Grid item xs={3}>
                <EditArea slideIndex={slideIndex} refetch={refetch}></EditArea>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </BackgroundContainer>
  );
};

export default PresentationEditPage;
