import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  Button,
  MenuItem,
  Icon,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux-toolkit/authSlice";
import { API, PAGE_ROUTES } from "../commons/constants";
import { AccountBox, ExitToApp } from "@mui/icons-material";
import useUserPopup from "../hooks/popup/useUserPopup";

const pages = [
  { link: PAGE_ROUTES.GROUP, text: "Group" },
  // { link: PAGE_ROUTES.PRESENT_OWNER, text: "Owner present" }
  // { link: PAGE_ROUTES.PRESENT_PLAYER, text: "Player play" },
  { link: PAGE_ROUTES.PRESENTATION, text: "Presentation" }
];
const settings = [
  { link: PAGE_ROUTES.PROFILE, text: "Profile", icon: <AccountBox /> }
];

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth);

  const dispatch = useDispatch();
  const {
    anchorEl: anchorElUser,
    handleCloseMenu: handleCloseUserMenu,
    handleOpenMenu: handleOpenUserMenu
  } = useUserPopup();

  const handleAvatarClick = React.useCallback(
    () => navigate(PAGE_ROUTES.LOGIN),
    [navigate]
  );

  const handleSignOut = async (e) => {
    try {
      await axios.post(API.LOGOUT);

      dispatch(logout());
      handleCloseUserMenu();
      setTimeout(() => {
        navigate(PAGE_ROUTES.LOGIN);
      }, 1000);
    } catch (error) {
      console.log(
        "🚀 ~ file: Header.jsx ~ line 47 ~ handleSignOut ~ error",
        error
      );
    }
  };

  return (
    <AppBar position="static" color="primary" sx={{ zIndex: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Normal view */}
          <Icon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <img src="/pageIcon.png" alt="" height={25} width={25} />
          </Icon>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none"
            }}
          >
            <Link
              to={PAGE_ROUTES.HOME}
              style={{
                color: "inherit",
                textDecoration: "none"
              }}
            >
              Aqiza
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                component={Link}
                to={`${page.link}`}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textDecoration: "none"
                }}
              >
                {page.text}
              </Button>
            ))}
          </Box>

          {/* Account */}
          <Box
            sx={{
              flexGrow: 0,
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              gap: 1
            }}
          >
            {user?.data?.name ? (
              <Typography>Hi, {user?.data?.name}</Typography>
            ) : null}

            <Tooltip title={`${user?.data ? "Open settings" : ""}`}>
              <IconButton
                onClick={user?.data ? handleOpenUserMenu : handleAvatarClick}
                sx={{ p: 0 }}
              >
                {/* Default & google avatar */}
                <Avatar
                  sx={
                    Object.keys(user).length === 0 || !user?.data?.picture
                      ? {
                          // Default profile pic
                          color: "#00A0FB",
                          background: "#b6ecff",
                          border: 2,
                          borderColor: "white"
                        }
                      : {
                          // Google profile pic
                          border: 2,
                          borderColor: "white"
                        }
                  }
                  alt="Remy Sharp"
                  src={user?.data?.picture}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.link}
                  onClick={() => {
                    handleCloseUserMenu();
                    setTimeout(() => {
                      navigate(setting.link);
                    }, 100);
                  }}
                >
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <ListItemText>{setting.text}</ListItemText>
                </MenuItem>
              ))}
              <MenuItem onClick={() => handleSignOut()}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText>Log out</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
