import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { Delete, Groups, Menu as MenuIcon } from "@mui/icons-material";
import useMenu from "../../hooks/popup/useMenu";
import { iconButton } from "./../../commons/globalStyles";
import { useNavigate } from "react-router-dom";

const BasicCard = ({ data, navigateTo }) => {
  const { anchorEl, handleCloseMenu, handleOpenMenu } = useMenu();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const options = [
    { link: navigateTo, text: "View", icon: <Groups /> },
    { link: navigateTo, text: "Delete", icon: <Delete /> }
  ];

  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: "5px", boxShadow: 3, position: "relative" }}
    >
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={handleOpenMenu}
      >
        <MenuIcon
          fontSize="small"
          sx={[
            iconButton,
            { bgcolor: "secondary.main", color: "primary.contrastText" }
          ]}
        />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {options.map((option) => (
          <MenuItem
            key={option.text}
            onClick={() => {
              handleCloseMenu();
              setTimeout(() => {
                navigate(option.link);
              }, 100);
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
      <CardContent
        onClick={() => {
          navigate(navigateTo);
        }}
        sx={{ cursor: "pointer" }}
      >
        <CardMedia
          component="img"
          height="140"
          image="/Groups/GroupCard.png"
          alt="Group photo"
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default BasicCard;
