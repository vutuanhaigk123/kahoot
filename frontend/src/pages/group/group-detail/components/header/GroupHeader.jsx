/* eslint-disable react-hooks/exhaustive-deps */
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
import { PAGE_ROUTES, ROLE } from "../../../../../commons/constants";
import BasicButton from "../../../../../components/button/BasicButton";
import PopupFormInvite from "../../../../../components/notification/PopUpFormInvite";
import usePopup from "../../../../../hooks/usePopup";
import { useSelector } from "react-redux";
import { useSocket } from "../../../../../context/socket-context";
import useGroup from "../../../../../hooks/socket/useGroup";
import useMenu from "../../../../../hooks/popup/useMenu";
import { useNavigate, useParams } from "react-router-dom";

const menuOptions = [
  {
    link: `${PAGE_ROUTES.PRESENT_PLAYER}?id=`,
    text: "As member",
    icon: <ManageAccounts />
  },
  {
    link: `${PAGE_ROUTES.PRESENT_CO_OWNER}?id=`,
    text: "As co-owner",
    icon: <Person />
  }
];

const GroupHeader = ({ isOwner }) => {
  const [joinOptions, setJoinOptions] = React.useState([
    {
      link: `${PAGE_ROUTES.PRESENT_PLAYER}?id=`,
      text: "As member",
      icon: <ManageAccounts />
    }
  ]);
  const [joinAsOwner, setJoinAsOwner] = React.useState(null);
  const { id: groupId } = useParams();
  const { groupSocketContext, setGroupSocketContext } = useSocket();
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const group = useSelector((state) => state.group);
  const auth = useSelector((state) => state.auth);

  const { isPresenting, presentationId } = useGroup(
    groupSocketContext,
    setGroupSocketContext
  );
  const { anchorEl, handleCloseMenu, handleOpenMenu } = useMenu();
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(isPresenting);
    if (isPresenting && auth?.user?.data?.id && group?.members) {
      group.members.forEach(({ _id, role }) => {
        if (_id === auth.user.data.id) {
          switch (role) {
            case ROLE.co_owner:
              setJoinOptions(menuOptions);
              break;
            case ROLE.owner:
              setJoinAsOwner(true);
              break;
            default:
              break;
          }
        }
      });
    }
  }, [auth, isPresenting]);

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
              {joinAsOwner ? (
                <>
                  <BasicButton
                    icon={<CoPresent />}
                    color="success"
                    onClick={() =>
                      navigate(
                        `${PAGE_ROUTES.PRESENT_OWNER}?id=${presentationId}&group=${groupId}`
                      )
                    }
                  >
                    Join presentation as owner
                  </BasicButton>
                </>
              ) : null}
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
                {joinOptions.map((item) => (
                  <MenuItem
                    key={item.link}
                    onClick={() => navigate(item.link + presentationId)}
                  >
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
