import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
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
import { handlePost } from "../../utils/fetch";
import { API } from "../../commons/constants";
import useStatus from "../../hooks/useStatus";
import usePopup from "../../hooks/usePopup";
import PopupMsg from "../notification/PopupMsg";

const BasicCard = ({ data, navigateTo, canDelete, refetch }) => {
  const { anchorEl, handleCloseMenu, handleOpenMenu } = useMenu();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClickMenu = (option) => {
    // Navigate if have link
    if (option.link) {
      handleCloseMenu();
      setTimeout(() => {
        navigate(option.link);
      }, 500);
    }

    // Handle delete
    if (option.handleFunc) {
      option.handleFunc(data._id);
      handleCloseMenu();
    }
  };

  const { status, handleStatus } = useStatus();
  const {
    open: openDeleteMsg,
    handleOpenPopup: handleOpenDeleteMsg,
    handleClosePopup: handleCloseDeleteMsg
  } = usePopup();
  const [isHandling, setIsHandling] = React.useState(false);
  const handleDeleteGroup = async (groupId) => {
    setIsHandling(true);
    // Handle data
    const resp = await handlePost(API.DELETE_GROUP, { groupId });
    console.log("🚀 ~ file: BasicCard.jsx:47 ~ handleDeleteGroup ~ resp", resp);

    handleStatus(resp); // update popup msg status
    handleOpenDeleteMsg(); // Open popup
    refetch();
    setIsHandling(false);
  };

  const options = [
    { link: navigateTo, text: "View", icon: <Groups /> },
    { handleFunc: handleDeleteGroup, text: "Delete", icon: <Delete /> }
  ];

  return (
    <>
      <Card
        variant="outlined"
        sx={{ borderRadius: "5px", boxShadow: 3, position: "relative" }}
      >
        {canDelete ? (
          isHandling ? (
            <CircularProgress
              size={30}
              sx={{ position: "absolute", top: 5, right: 5 }}
            />
          ) : (
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
          )
        ) : null}
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {options.map((option) => (
            <MenuItem key={option.text} onClick={() => handleClickMenu(option)}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
        <CardContent
          onClick={() => {
            navigate(navigateTo);
          }}
          sx={{
            cursor: isHandling === true ? "default" : "pointer",
            pointerEvents: isHandling === true ? "none" : null
          }}
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
      <div className="group-modal">
        {/* Popup message on update question */}
        <PopupMsg
          status={status.type}
          isOpen={openDeleteMsg}
          handleClosePopup={handleCloseDeleteMsg}
          hideOnSuccess={true}
        >
          {status.msg}
        </PopupMsg>
      </div>
    </>
  );
};

export default BasicCard;
