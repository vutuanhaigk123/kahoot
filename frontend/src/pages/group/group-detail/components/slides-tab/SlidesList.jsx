import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardMedia,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { API, PAGE_ROUTES } from "../../../../../commons/constants";
import BasicButton from "./../../../../../components/button/BasicButton";
import { Edit, PlayCircleFilledWhite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import usePopup from "./../../../../../hooks/usePopup";
import PopupForm from "../../../../../components/notification/PopupForm";

const SlidesList = () => {
  const navigate = useNavigate();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  return (
    <>
      <Paper
        sx={{
          p: "40px 40px 20px 40px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          maxWidth: "80%",
          margin: "auto",
          gap: 2
        }}
        elevation={5}
      >
        {/* Slide item */}
        <Card
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            boxShadow: 4
          }}
        >
          {/* Left side */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Slide img */}
            <CardMedia
              component="img"
              sx={{ width: 200 }}
              image="/Slides/SlidesList.png"
              alt="Slides image"
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "column",
                justifyContent: "space-between",
                p: "20px 0 20px 0"
              }}
            >
              <Typography variant="h5">Slides name</Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar></Avatar>
                <Typography variant="h7">Name</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end"
            }}
          >
            <CardActions>
              <BasicButton
                size="small"
                width="100%"
                icon={<Edit />}
                variant="contained"
                onClick={() => navigate(PAGE_ROUTES.SLIDES + `/${1}`)}
              >
                Edit
              </BasicButton>
              <BasicButton
                size="small"
                width="100%"
                icon={<PlayCircleFilledWhite />}
                variant="contained"
              >
                Start
              </BasicButton>
            </CardActions>
          </Box>
        </Card>
        {/* Create more slide */}
        <BasicButton sx={{ m: "auto" }} onClick={handleOpenPopup}>
          Create slide
        </BasicButton>
        <PopupForm
          isOpen={open}
          handleClose={handleClosePopup}
          // refetch={refetch}
          // api={API.CREATE_GROUP}
          header="What will you call your slide ?"
          label="Slide's name"
        ></PopupForm>
      </Paper>
    </>
  );
};

export default SlidesList;
