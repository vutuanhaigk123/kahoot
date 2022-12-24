import { CoPresent, Group, ManageAccounts, Person } from "@mui/icons-material";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import React from "react";
import { PAGE_ROUTES } from "../../../../../commons/constants";
import BasicButton from "../../../../../components/button/BasicButton";
import PopupFormInvite from "../../../../../components/notification/PopUpFormInvite";
import usePopup from "../../../../../hooks/usePopup";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../../context/socket-context";
import useGroup from "../../../../../hooks/socket/useGroup";
import useMenu from "../../../../../hooks/popup/useMenu";
import { useNavigate } from "react-router-dom";

const id = "63a67ad7fc8fa6670f49a795&slide=63a67addfc8fa6670f49a79d";

const menuOptions = [
  {
    link: `${PAGE_ROUTES.PRESENT_PLAYER}?id=${id}`,
    text: "As member",
    icon: <ManageAccounts />
  },
  {
    link: `${PAGE_ROUTES.PRESENT_CO_OWNER}?id=${id}`,
    text: "As co-owner",
    icon: <Person />
  }
];

const GroupHeader = ({ isOwner }) => {
  const { groupSocketContext, setGroupSocketContext } = useSocket();
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const group = useSelector((state) => state.group);

  const { isPresenting } = useGroup(groupSocketContext, setGroupSocketContext);
  const { anchorEl, handleCloseMenu, handleOpenMenu } = useMenu();
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

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
          {isPresenting === true ? (
            <>
              <BasicButton
                icon={<CoPresent />}
                color="success"
                onClick={handleOpenMenu}
              >
                Join presentation
              </BasicButton>
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
          {isOwner ? (
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
          inviteLink={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.JOIN}?id=${group?.info?.gId}&token=${group?.info?.inviteToken}`}
          groupId={group?.info?.gId}
        ></PopupFormInvite>
      </div>
    </Box>
  );
};

export default GroupHeader;
