import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { PAGE_ROUTES } from "../../../../../commons/constants";
import BasicButton from "./../../../../../components/button/BasicButton";
import { Edit, PlayCircleFilledWhite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SlidesList = () => {
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        p: 6,
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
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
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
    </Paper>
  );
};

export default SlidesList;
