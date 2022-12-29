/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  questionType,
  WS_CLOSE,
  WS_CMD,
  WS_EVENT,
  WS_PATH
} from "../../../commons/constants";
import {
  clearSocket,
  setSocket
} from "../../../redux-toolkit/socketPlayerSlice";

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

const handleSubmitChoice = ({ socket, choiceId }) => {
  if (socket) {
    console.log(choiceId);
    socket.emit(WS_CMD.SUBMIT_CHOICE_CMD, choiceId);
  } else {
    console.log("Not connected to server");
  }
};

const handleSendComment = (ws, data) => {
  if (ws?.connected) {
    ws.emit(WS_CMD.SEND_CMT_CMD, data);
  }
};

const handleSendQuestion = (ws, data) => {
  if (ws?.connected) {
    ws.emit(WS_CMD.SEND_QUESTION_CMD, data);
  }
};

const usePresentationPlayer = (socketContext, setSocketContext, id, slide) => {
  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [ws, setWs] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [question, setQuestion] = React.useState(null);
  const [isVoted, setIsVoted] = React.useState(false);
  const [msgClose, setMsgClose] = React.useState(null);
  const [isEndPresent, setIsEndPresent] = React.useState(false);
  const [curQuesType, setCurQuesType] = React.useState(
    questionType.MULTIPLE_CHOICE
  );

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
    setQuestion(arg.curQues.question);
    setCurQuesType(arg.curQues.type);
  };

  // Connect socket
  React.useEffect(() => {
    const wsDomain = getDomain();
    let socket = null;
    console.log(wsDomain + WS_PATH.MATCH);

    // Check id valid
    if (!id) {
      return () => {
        if (ws) socket.close();
      };
    }
    console.log("hit - player");

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
      socketContext.emit(WS_EVENT.INIT_CONNECTION_EVENT, {
        cmd: WS_CMD.JOIN_ROOM_CMD,
        room: id
      });

      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        if (arg.isVoted) {
          setIsVoted(true);
        }
        handleSetData(arg);

        dispatch(setSocket(arg));
        console.log("==========================================");
        console.log(arg);
      });

      socketContext.on(WS_CLOSE.CLOSE_REASON, (arg) => {
        console.log(
          "================= Closing connection signal from server ======================",
          arg
        );
        switch (arg) {
          case WS_CLOSE.REASON_NOT_FOUND_CONTENT:
            setMsgClose("Not found content");
            break;
          case WS_CLOSE.REASON_WAITING_FOR_HOST:
            setMsgClose("Waiting for host present");
            break;
          case WS_CLOSE.REASON_SELF_HOSTED_PRESENTATION:
            setMsgClose("You can not join to self hosted presentation to vote");
            break;
          case WS_CLOSE.REASON_HAS_NEW_CONNECTION:
            setMsgClose("You has already joined room in another tab");
            break;
          case WS_CLOSE.REASON_SLIDE_HAS_NO_ANS:
            console.log("slide has no answer");
          // eslint-disable-next-line no-fallthrough
          case WS_CLOSE.REASON_INVALID_CMD:
          default:
            setMsgClose("Unknown Server Error");
            break;
        }
        setSocketContext(null);
        dispatch(clearSocket());
        setWs(null);
      });

      socketContext.io.on("close", (reason) => {
        if (reason !== "forced close") {
          return console.log(
            "PresentationPlayerPage: error to connect socket, " + reason
          );
        }
      });

      return () => {
        if (socketContext) {
          socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
          socketContext.off(WS_CLOSE.CLOSE_REASON);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.RECEIVE_CHOICE_EVENT, (arg) => {
        console.log(
          "=====================Another member has made a choice====================="
        );
        console.log(arg);
        if (arg.id === user.data.id) {
          setIsVoted(true);
          setData(arg.curQues.answers);
        } else {
          const choiceId = arg.choiceId.toString();
          const index = toIndex(data, choiceId);
          if (index !== -1) {
            data[index].total += 1;
            return setData([...data]);
          }
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT, (arg) => {
        console.log("===Next slide===");
        if (arg.isVoted) {
          setIsVoted(true);
        } else {
          setIsVoted(false);
        }
        handleSetData(arg);
      });

      socketContext.on(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT, (arg) => {
        console.log("===Prev slide===");
        if (arg.isVoted) {
          setIsVoted(true);
        } else {
          setIsVoted(false);
        }
        handleSetData(arg);
      });

      return () => {
        if (socketContext) {
          socketContext.off(WS_EVENT.RECEIVE_CHOICE_EVENT);
          socketContext.off(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT);
          socketContext.off(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT);
        }
      };
    }
  }, [socketContext, data]);

  return {
    ws,
    data,
    question,
    isVoted,
    msgClose,
    handleSubmitChoice,
    handleSendComment,
    handleSendQuestion,
    isEndPresent,
    curQuesType
  };
};

export default usePresentationPlayer;
