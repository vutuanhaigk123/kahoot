/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { WS_EVENT, WS_PATH } from "../../../commons/constants";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import { useSocket } from "../../../context/socket-context";
import MemberList from "./components/member-list-tab/MemberList";

const getDomain = () => {
  let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
  if (window.location.hostname.includes("localhost")) {
    wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
  }
  return wsDomain;
};

const GroupDetailPage = () => {
  const { groupSocketContext, setGroupSocketContext } = useSocket();
  const [ws, setWs] = React.useState(null);
  const { id: groupId } = useParams();

  // Handle init connection
  React.useEffect(() => {
    const wsDomain = getDomain();
    let socket = null;
    console.log("hit - group socket");

    if (!groupSocketContext) {
      socket = io(wsDomain + WS_PATH.GROUP, {
        withCredentials: true
      });

      socket.on("connect", () => {
        setGroupSocketContext(socket);
      });
    } else {
      socket = groupSocketContext;
    }
    setWs(socket);
    return () => {
      socket.off("connect");
    };
  }, []);

  // Handle events
  React.useEffect(() => {
    if (groupSocketContext) {
      groupSocketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, { groupId });

      groupSocketContext.on(WS_EVENT.GROUP_RECEIVE_PRESENTING_EVENT, (arg) => {
        console.log("Dang co present nay ba con", arg);
      });

      return () => {
        groupSocketContext.off(WS_EVENT.GROUP_RECEIVE_PRESENTING_EVENT);
      };
    }
  }, [groupSocketContext]);
  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "60%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <MemberList></MemberList>
      </Box>
    </BackgroundContainer>
  );
};

export default GroupDetailPage;
