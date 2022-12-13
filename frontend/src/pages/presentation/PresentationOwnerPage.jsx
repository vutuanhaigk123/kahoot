/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Paper, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { io } from "socket.io-client";
import {
  PAGE_ROUTES,
  SUBMIT_STATUS,
  WS_CLOSE,
  WS_CMD,
  WS_EVENT
} from "../../commons/constants";
import PresentationChart from "../../components/chart/PresentationChart";
import PopupMsg from "../../components/notification/PopupMsg";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import BasicButton from "../../components/button/BasicButton";
import { Chat, ContentCopy, Link, QuestionAnswer } from "@mui/icons-material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { iconButton, iconHover } from "./../../commons/globalStyles";
import usePopup from "./../../hooks/usePopup";
import OwnerQuestionModal from "./modal/owner/OwnerQuestionModal";
import ChatBox from "./modal/chat/ChatBox";

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

const PresentationOwnerPage = () => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [msgClose, setMsgClose] = useState("Not found content");
  const [question, setQuestion] = useState(null);
  const [isCopy, setIsCopy] = React.useState(false);
  const {
    open: openQuestion,
    handleOpenPopup: handleOpenQuestionPopup,
    handleClosePopup: handleCloseQuestionPopup
  } = usePopup();
  const {
    open: openChat,
    handleOpenPopup: handleOpenChatPopup,
    handleClosePopup: handleCloseChatPopup
  } = usePopup();
  const [isEnd, setIsEnd] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");
  console.log("---------------------------------------");
  console.log(id, slide);

  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }

    if (!id || !slide) {
      return () => {
        if (ws) socket.close();
      };
    }
    console.log("hit");
    const socket = io(wsDomain, {
      withCredentials: true
    });

    socket.on("connect", () => {
      socket.emit(WS_EVENT.INIT_CONNECTION_EVENT, {
        cmd: WS_CMD.CREATE_ROOM_CMD,
        room: id,
        slide
      });
    });

    socket.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
      setIsConnected(true);
      setQuestion(arg.curQues.question);
      setData(arg.curQues.answers);
      if (arg.isFirst === true) {
        setIsFirst(true);
      } else if (arg.isEnd === true) {
        setIsEnd(true);
      }
      console.log("==========================================");
      console.log(arg);
    });

    socket.on(WS_EVENT.RECEIVE_NEXT_SLIDE_EVENT, (arg) => {
      console.log("==================Next slide========================");
      console.log(arg);
      setQuestion(arg.curQues.question);
      setData(arg.curQues.answers);
      setIsFirst(false);
      if (arg.isEnd === true) {
        setIsEnd(true);
      }
    });

    socket.on(WS_EVENT.RECEIVE_PREV_SLIDE_EVENT, (arg) => {
      console.log("====================Prev Slide======================");
      console.log(arg);
      setQuestion(arg.curQues.question);
      setData(arg.curQues.answers);
      setIsEnd(false);
      if (arg.isFirst === true) {
        setIsFirst(true);
      }
    });

    socket.on(WS_EVENT.RECEIVE_CMT_EVENT, (arg) => {
      console.log(
        "=====================Another member has commented====================="
      );
      console.log(arg);
    });

    socket.on(WS_EVENT.RECEIVE_QUESTION_EVENT, (arg) => {
      console.log(
        "=====================Another member has commented====================="
      );
      console.log(arg);
    });

    socket.on(WS_CLOSE.CLOSE_REASON, (arg) => {
      console.log(
        "================= Closing connection signal from server ======================",
        arg
      );
      switch (arg) {
        case WS_CLOSE.REASON_HAS_NEW_CONNECTION:
          setMsgClose("Only support 1 connection at a time");
          break;
        case WS_CLOSE.REASON_NOT_FOUND_CONTENT:
          setMsgClose("Not found content");
          break;
        case WS_CLOSE.REASON_WAITING_FOR_HOST:
          setMsgClose("Waiting for host present");
          break;
        case WS_CLOSE.REASON_SLIDE_HAS_NO_ANS:
          console.log("slide has no answer");
        // eslint-disable-next-line no-fallthrough
        case WS_CLOSE.REASON_INVALID_CMD:
        default:
          setMsgClose("Unknown Server Error");
          break;
      }
      setWs(null);
    });

    // socket.on(JOIN_ROOM_EVENT, (arg) => {
    //   console.log(
    //     "=====================Member has just joined room====================="
    //   );
    //   console.log(arg);
    // });

    // socket.on(EXIT_ROOM_EVENT, (arg) => {
    //   console.log(
    //     "=====================Member has just leaved room====================="
    //   );
    //   console.log(arg);
    // });

    socket.io.on("close", (reason) => {
      if (reason !== "forced close") {
        return console.log(
          "PresentationOwnerPage: error to connect socket, " + reason
        );
      }
      setIsConnected(false);
    });

    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);

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

  return (
    <BackgroundContainer>
      {isConnected && id && slide ? (
        <Paper
          elevation={10}
          sx={{
            width: "80%",
            height: "70vh",
            m: "auto",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            p: 2
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            {question}
          </Typography>
          <CopyToClipboard
            text={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.SLIDES_JOIN}?id=${id}&slide=${slide}`}
          >
            <BasicButton
              icon={isCopy ? <ContentCopy /> : <Link />}
              onClick={() => setIsCopy(true)}
              color={isCopy ? "success" : "primary"}
              sx={{ mb: 2 }}
            >
              {isCopy ? "Link coppied" : "Get invite link"}
            </BasicButton>
          </CopyToClipboard>
          <PresentationChart data={data} height={"100%"} />
          {!isEnd ? (
            <BasicButton onClick={() => handleNextSlide(ws)}>Next</BasicButton>
          ) : (
            ""
          )}
          {!isFirst ? (
            <BasicButton onClick={() => handlePrevSlide(ws)}>Prev</BasicButton>
          ) : (
            ""
          )}
          <BasicButton
            onClick={() => handleSendComment(ws, "Day la chat test")}
          >
            Send chat
          </BasicButton>
          <Box
            direction="row"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              gap: "10px"
            }}
          >
            <Tooltip title="Chat" variant="soft">
              <Chat
                sx={[iconHover(), iconButton]}
                onClick={handleOpenChatPopup}
              />
            </Tooltip>
            <Tooltip title="Q&A" variant="soft">
              <QuestionAnswer
                sx={[iconHover(), iconButton]}
                onClick={handleOpenQuestionPopup}
              />
            </Tooltip>
          </Box>

          {/* Question modal */}
          <OwnerQuestionModal
            isOpen={openQuestion}
            handleClosePopup={handleCloseQuestionPopup}
          ></OwnerQuestionModal>

          {/* Chat modal */}
          <ChatBox
            isOpen={openChat}
            handleClosePopup={handleCloseChatPopup}
          ></ChatBox>
        </Paper>
      ) : null}
      <PopupMsg
        isOpen={!isConnected && !ws}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        {msgClose}
      </PopupMsg>
    </BackgroundContainer>
  );
};

export default PresentationOwnerPage;
