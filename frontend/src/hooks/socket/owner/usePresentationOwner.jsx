import React from "react";
import { io } from "socket.io-client";
import {
  ROLE,
  WS_CLOSE,
  WS_CMD,
  WS_EVENT,
  WS_PATH
} from "../../../commons/constants";

const getDomain = () => {
  let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
  if (window.location.hostname.includes("localhost")) {
    wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
  }
  return wsDomain;
};

const toIndex = (dataChart, choiceId) => {
  console.log(dataChart);
  return dataChart.findIndex((choice) => choice.id === choiceId);
};

const handleNextSlide = (ws) => {
  if (ws?.connected) {
    ws.emit(WS_CMD.NEXT_SLIDE_CMD);
  }
};

const handlePrevSlide = (ws) => {
  if (ws?.connected) {
    ws.emit(WS_CMD.PREV_SLIDE_CMD);
  }
};

const handleSendComment = (ws, data) => {
  if (ws?.connected) {
    ws.emit(WS_CMD.SEND_CMT_CMD, data);
  }
};

const usePresentationOwner = (
  socketContext,
  setSocketContext,
  id,
  slide,
  group,
  role = ROLE.owner
) => {
  // Socket context state
  // To-do: slide id and presentation id needed
  const [ws, setWs] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [question, setQuestion] = React.useState(null);
  const [msgClose, setMsgClose] = React.useState("Not found content");
  const [isConnected, setIsConnected] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);
  const [isFirst, setIsFirst] = React.useState(false);

  // Connect socket
  React.useEffect(() => {
    const wsDomain = getDomain();
    let socket = null;

    // Check id && slide valid
    if (!id || (role === ROLE.owner && !slide)) {
      return () => {
        if (ws) socket.close();
      };
    }
    console.log("hit - owner/ co-owner");

    if (!socketContext) {
      socket = io(wsDomain + WS_PATH.MATCH, {
        withCredentials: true
      });

      socket.on("connect", () => {
        setSocketContext(socket);
      });
    } else {
      socket = socketContext;
    }
    setWs(socket);
    return () => {
      socket.off("connect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle event
  React.useEffect(() => {
    if (socketContext) {
      // default: owner's package
      let initPackage = {
        cmd: WS_CMD.CREATE_ROOM_CMD,
        room: id,
        slide
      };
      if (group && group.trim().length > 0) {
        initPackage.group = group.trim();
      }

      if (role === ROLE.co_owner) {
        initPackage = {
          cmd: WS_CMD.JOIN_AS_CO_OWNER,
          room: id
        };
      }

      socketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, initPackage);

      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        setIsConnected(true);
        setQuestion(arg.curQues.question);
        setData(arg.curQues.answers);
        setIsFirst(arg.isFirst);
        setIsEnd(arg.isEnd);
        console.log("==========================================");
        console.log(arg);
      });

      socketContext.on(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT, (arg) => {
        console.log("==================Next slide========================");
        console.log(arg);
        setQuestion(arg.curQues.question);
        setData(arg.curQues.answers);
        setIsFirst(false);
        if (arg.isEnd === true) {
          setIsEnd(true);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT, (arg) => {
        console.log("====================Prev Slide======================");
        console.log(arg);
        setQuestion(arg.curQues.question);
        setData(arg.curQues.answers);
        setIsEnd(false);
        if (arg.isFirst === true) {
          setIsFirst(true);
        }
      });

      socketContext.on(WS_CLOSE.CLOSE_REASON, (arg) => {
        console.log(
          "================= Closing connection signal from server ======================",
          arg
        );
        switch (arg) {
          case WS_CLOSE.REASON_HAS_NEW_CONNECTION:
            setMsgClose("You has already joined room in another tab");
            break;
          case WS_CLOSE.REASON_NOT_FOUND_CONTENT:
            setMsgClose("Not found content");
            break;
          case WS_CLOSE.REASON_WAITING_FOR_HOST:
            setMsgClose("Waiting for host present");
            break;
          case WS_CLOSE.REASON_SELF_HOSTED_PRESENTATION:
            setMsgClose("You can not join to self hosted presentation to vote");
            break;
          case WS_CLOSE.REASON_INVALID_CMD:
            setMsgClose("Invalid to present this presentation");
            break;
          case WS_CLOSE.REASON_SLIDE_HAS_NO_ANS:
            console.log("slide has no answer");
          // eslint-disable-next-line no-fallthrough

          default:
            setMsgClose("Unknown Server Error");
            break;
        }
        setSocketContext(null);
        setWs(null);
      });

      socketContext.io.on("close", (reason) => {
        if (reason !== "forced close") {
          return console.log(
            "PresentationOwnerPage: error to connect socket, " + reason
          );
        }
        setIsConnected(false);
      });

      return () => {
        socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT);
        socketContext.off(WS_CLOSE.CLOSE_REASON);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  React.useEffect(() => {
    if (ws) {
      ws.on(WS_EVENT.RECEIVE_CHOICE_EVENT, (arg) => {
        console.log(
          "=====================Another player has make a choice====================="
        );
        console.log(arg);
        const choiceId = arg.choiceId.toString();
        const index = toIndex(data, choiceId);
        if (index !== -1) {
          data[index].total += 1;
          return setData([...data]);
        }
      });
      return () => ws.off(WS_EVENT.RECEIVE_CHOICE_EVENT);
    }
  }, [ws, data]);

  return {
    isEnd,
    isFirst,
    isConnected,
    data,
    ws,
    msgClose,
    question,
    handleNextSlide,
    handlePrevSlide,
    handleSendComment
  };
};

export default usePresentationOwner;
