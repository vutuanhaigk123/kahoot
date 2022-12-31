import { Group, Login, ManageAccounts, Person } from "@mui/icons-material";
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import React from "react";
import { PAGE_ROUTES, ROLE } from "../../../../../commons/constants";
import BasicButton from "../../../../../components/button/BasicButton";
import PopupFormInvite from "../../../../../components/notification/PopUpFormInvite";
import usePopup from "../../../../../hooks/usePopup";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../../context/socket-context";
import useGroup from "../../../../../hooks/socket/useGroup";
import useMenu from "../../../../../hooks/popup/useMenu";
import { useNavigate, useParams } from "react-router-dom";

const GroupHeader = ({ userRole }) => {
  const { id: groupId } = useParams();
  const { groupSocketContext, setGroupSocketContext } = useSocket();
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const group = useSelector((state) => state.group);

  const { isPresenting, presentationId } = useGroup(
    groupSocketContext,
    setGroupSocketContext
  );
  const menuOptions = [
    {
      link: `${PAGE_ROUTES.PRESENT_PLAYER}?id=${presentationId}`,
      text: "Join as member",
      icon: <Person />
    },
    {
      link: `${PAGE_ROUTES.PRESENT_CO_OWNER}?id=${presentationId}`,
      text: "Join as co-owner",
      icon: <ManageAccounts />
    }
  ];
  const { anchorEl, handleCloseMenu, handleOpenMenu } = useMenu();
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleJoin = (event) => {
    switch (userRole) {
      case ROLE.owner:
        navigate(
          `${PAGE_ROUTES.PRESENT_OWNER}?id=${presentationId}&group=${groupId}`
        );
        break;
      case ROLE.member:
        navigate(`${PAGE_ROUTES.PRESENT_PLAYER}?id=${presentationId}`);
        break;
      case ROLE.co_owner:
        handleOpenMenu(event);
        break;

      default:
        break;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h4">{group.name}</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Notification */}
          {isPresenting ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  border: 1,
                  borderColor: "transparent",
                  borderRadius: 1,
                  alignItems: "center",
                  p: 1,
                  bgcolor: "success.main",
                  color: "white"
                }}
                color="success"
              >
                <Typography sx={{ userSelect: "none" }}>
                  A presentation is happening
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ ml: 1, mr: 1 }}
                  color="white"
                />
                <Login
                  color="white"
                  sx={{ cursor: "pointer" }}
                  onClick={handleJoin}
                />
              </Box>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
              >
                {menuOptions.map((item) => (
                  <MenuItem key={item.link} onClick={() => navigate(item.link)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : null}

          {/* Invite button */}
          {userRole === ROLE.owner || userRole === ROLE.co_owner ? (
            <BasicButton
              sx={{ minWidth: "100px", boxShadow: 4 }}
              icon={<Group />}
              onClick={handleOpenPopup}
            >
              Invite
            </BasicButton>
          ) : null}
        </Box>
      </Box>
      <div className="modal-header">
        {/* Popup form */}
        <PopupFormInvite
          isOpen={open}
          handleClose={handleClosePopup}
          inviteLink={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.JOIN}?id=${group?.gId}&token=${group?.inviteToken}`}
          groupId={group?.gId}
        ></PopupFormInvite>
      </div>
    </Box>
  );
};

export default GroupHeader;
