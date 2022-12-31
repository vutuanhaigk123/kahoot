import React from "react";
import { io } from "socket.io-client";
import { PAGE_ROUTES } from "../../../commons/constants";
import { useNavigate } from "react-router-dom";
import {
  questionType,
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
  const [curQuesType, setCurQuesType] = React.useState(
    questionType.MULTIPLE_CHOICE
  );
  const [userShortInfoList, setUserShortInfoList] = React.useState([]);

  const handleSetData = (arg) => {
    switch (arg.curQues.type) {
      case questionType.MULTIPLE_CHOICE:
        setData(arg.curQues.answers);
        break;
      case questionType.HEADING:
        setData(arg.curQues.heading);
        break;
      case questionType.PARAGRAPH:
        setData(arg.curQues.paragraph);
        break;

      default:
        break;
    }
    setCurQuesType(arg.curQues.type);
    setQuestion(arg.curQues.question);
  };
  const navigate = useNavigate();

  // Connect socket
  React.useEffect(() => {
    const wsDomain = getDomain();
    let socket = null;

    // Check id && slide valid
    if (!id /*|| (role === ROLE.owner && !slide)*/) {
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
        room: id
      };
      if (group && group.trim().length > 0) {
        initPackage.group = group.trim();
      }
      if (role === ROLE.owner && slide) {
        initPackage.slide = slide;
      }

      if (role === ROLE.co_owner) {
        initPackage = {
          cmd: WS_CMD.JOIN_AS_CO_OWNER,
          room: id
        };
      }

      socketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, initPackage);

      socketContext.on(WS_CMD.CLOSE_PREV_PRESENTATION, () => {
        console.log("Presentation ended");
        setMsgClose(
          "Phải hiện popup hỏi có tắt cái presentation cũ trong group này ko, có nút yes/no "
        );
        socketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, initPackage);
        setIsConnected(false);
        // Nhấn Yes phải làm 3 thứ:
        // 1/ socketContext.emit(WS_CMD.CLOSE_PREV_PRESENTATION, WS_DATA.ALLOW_CLOSE_PREV_PRESENTATION)
        // 2/ chờ nhận event từ server: socketContext.on(WS_CMD.CLOSE_PREV_PRESENTATION), nhận đc event này thì mới làm bước 3,
        // nếu ko nhận thì ko đc sang bước 3
        // 3/ gửi lại socketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, initPackage);
        // Nhấn No: socketContext.emit(WS_CMD.CLOSE_PREV_PRESENTATION, WS_DATA.DENIED_CLOSE_PREV_PRESENTATION),
        // bước này t trả về cho m presentationId cũ ở trong group, để m điều hướng user về trang present đó
        // nhận event ở socketContext.emit(WS_EVENT.RECEIVE_PREV_PRESENTATION, ({presentationId}) => {})
      });

      socketContext.on(WS_EVENT.RECEIVE_PREV_PRESENTATION, (arg) => {
        console.log("===Keep presentation===");
        console.log(arg.presentationId);
        // Redirect to prev presentation
        var navPath = `${PAGE_ROUTES.SLIDES_PRESENT}?id=${arg.presentationId}`;
        if (group) {
          navPath = `${navPath}&group=${group}`;
        }
        navigate(navPath);
      });

      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        setIsConnected(true);
        handleSetData(arg);
        setUserShortInfoList(arg.userShortInfoList);
        setIsFirst(arg.isFirst);
        setIsEnd(arg.isEnd);
        console.log("==========================================");
        console.log(arg);
      });

      socketContext.on(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT, (arg) => {
        console.log("==================Next slide========================");
        console.log(arg);
        handleSetData(arg);
        setIsFirst(false);
        if (arg.isEnd === true) {
          setIsEnd(true);
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT, (arg) => {
        console.log("====================Prev Slide======================");
        console.log(arg);
        handleSetData(arg);
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
            setMsgClose("This presentation has no slide to present");
            break;
          case WS_CLOSE.REASON_CLOSE_PREV_PRESENTATION:
            console.log("M tự xử lý đi Duy");
            break;
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
          // Handle shortUserInfo
          if (
            userShortInfoList.find((item) => item.id === arg.id) === undefined
          ) {
            setUserShortInfoList((prv) => [
              ...prv,
              { id: arg.id, name: arg.name, email: arg.email }
            ]);
          }
          // Handle data (answers)
          if (data[index].choiceUserInfo) {
            data[index].choiceUserInfo.push({ id: arg.id, ts: arg.ts });
          } else {
            data[index].choiceUserInfo = [{ id: arg.id, ts: arg.ts }];
          }
          data[index].total += 1;
          return setData([...data]);
        }
      });
      return () => ws.off(WS_EVENT.RECEIVE_CHOICE_EVENT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    handleSendComment,
    curQuesType,
    userShortInfoList
  };
};

export default usePresentationOwner;
