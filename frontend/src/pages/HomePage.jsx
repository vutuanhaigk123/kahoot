import React from "react";
import { Avatar, Box, Button, Paper, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box
      sx={{
        height: "90vh",
        backgroundImage: `url(SignUp/background.png)`,
        backgroundSize: "cover",
        p: 4
      }}
      display="flex"
    >
      <Box
        elevation={20}
        sx={{
          margin: "auto",
          width: "40%",
          textAlign: "center"
        }}
      >
        <Avatar
          src="pageIcon.png"
          sx={{
            margin: "auto",
            width: "100px",
            height: "100px",
            "& .MuiAvatar-img": {
              objectFit: "scale-down"
            }
          }}
        ></Avatar>
        <Typography variant="h2" color="primary">
          Trang chủ
        </Typography>
        <Typography variant="h4" color="primary">
          Kahoot tuổi tôm - Chưa có ý :(
        </Typography>
        <Paper sx={{ width: "50%", height: 40, margin: "auto" }}>
          <Button
            variant="contained"
            sx={{ color: "white", backgroundColor: "black" }}
          >
            Submit
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
