import React from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import BackgroundContainer from "./../components/misc/BackgroundContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../commons/constants";
import BasicButton from "../components/button/BasicButton";
import useToggle from "../hooks/useToggle";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { value: showLinkTextBox, toggleValue: toggleLinkTextBox } =
    useToggle(false);
  const linkTextbox = React.useRef(null);

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
        {showLinkTextBox ? (
          <Box sx={{ display: "flex", width: "40vw" }}>
            <TextField
              variant="filled"
              sx={{ bgcolor: "white", borderRadius: "5px" }}
              placeholder="Presentation's link"
              label="Presentation's link"
              fullWidth
              inputRef={linkTextbox}
            ></TextField>
            <BasicButton
              onClick={() => window.location.replace(linkTextbox.current.value)}
            >
              Join
            </BasicButton>
          </Box>
        ) : (
          <>
            <Typography variant="h2" color="#fbf7d1">
              Ready to learn
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                !user.data ? navigate(PAGE_ROUTES.LOGIN) : toggleLinkTextBox();
              }}
            >
              Join room
            </Button>
          </>
        )}
      </Box>
    </BackgroundContainer>
  );
};

export default HomePage;
