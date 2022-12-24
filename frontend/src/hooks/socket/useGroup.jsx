import React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { WS_EVENT, WS_PATH } from "../../commons/constants";

const getDomain = () => {
  let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
  if (window.location.hostname.includes("localhost")) {
    wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
  }
  return wsDomain;
};

const useGroup = (groupSocketContext, setGroupSocketContext) => {
  const [ws, setWs] = React.useState(null);
  const { id: groupId } = useParams();
  const [isPresenting, setIsPresenting] = React.useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle events
  React.useEffect(() => {
    if (groupSocketContext) {
      groupSocketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, { groupId });

      groupSocketContext.on(WS_EVENT.GROUP_RECEIVE_PRESENTING_EVENT, (arg) => {
        console.log("Dang co present nay ba con", arg);
        setIsPresenting(true);
      });

      return () => {
        groupSocketContext.off(WS_EVENT.GROUP_RECEIVE_PRESENTING_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupSocketContext]);
  return { isPresenting };
};

export default useGroup;
