import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import BackgroundContainer from "./../components/misc/BackgroundContainer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PAGE_ROUTES } from "../commons/constants";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <BackgroundContainer url="/HomePage/homePagePic.jpg">
      <Box
        sx={{
          margin: "auto",
          width: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2
        }}
      >
        <Avatar
          src="/pageIcon.png"
          sx={{
            margin: "auto",
            width: "200px",
            height: "200px",
            "& .MuiAvatar-img": {
              objectFit: "scale-down"
            }
          }}
        ></Avatar>
        <Typography variant="h2" color="#fbf7d1">
          Ready to learn
        </Typography>
        <Button
          component={Link}
          to={Object.keys(user).length === 0 ? PAGE_ROUTES.LOGIN : "#"}
          variant="contained"
          color="secondary"
          sx={{ maxWidth: "30%" }}
        >
          Get started
        </Button>

        {/* <Box sx={{ width: "100%" }}>
          <Box
            component="img"
            src="/HomePage/homePagePic.png"
            alt="abc"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "scale-down",
              borderRadius: 2
              // borderColor: "black"
            }}
          />
        </Box> */}
      </Box>
    </BackgroundContainer>
  );
};

export default HomePage;
