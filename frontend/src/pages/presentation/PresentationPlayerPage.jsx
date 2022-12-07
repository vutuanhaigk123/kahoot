/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Badge, Box, Grid, Paper, Typography } from "@mui/material";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import {
  SUBMIT_STATUS,
  WS_CLOSE,
  WS_CMD,
  WS_EVENT
} from "../../commons/constants";
import PopupMsg from "../../components/notification/PopupMsg";
import { useSelector } from "react-redux";

const handleSubmitChoice = ({ socket, choiceId }) => {
  if (socket) {
    console.log(choiceId);
    socket.emit(WS_EVENT.SUBMIT_CHOICE_EVENT, choiceId);
  } else {
    console.log("Not connected to server");
  }
};

const PresentationPlayerPage = () => {
  const { user } = useSelector((state) => state?.auth);
  const [msgClose, setMsgClose] = useState(null);
  const [isVoted, setIsVoted] = useState(false);
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");

  const [ws, setWs] = useState(null);
  const [question, setQuestion] = useState(null);
  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }

    const socket = io(wsDomain, {
      query: `cmd=${WS_CMD.JOIN_ROOM_CMD}&room=${id}&slide=${slide}}`,
      withCredentials: true
    });

    socket.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
      console.log("==========================================");
      console.log(arg);
      setQuestion(arg.curQues);
    });

    socket.on(WS_EVENT.RECEIVE_CHOICE_EVENT, (arg) => {
      console.log(
        "=====================Another member has make a choice====================="
      );
      console.log(arg);
      if (arg.id === user.data.id) {
        setIsVoted(true);
      }
    });

    socket.on(WS_CLOSE.CLOSE_REASON, (arg) => {
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

    socket.io.on("close", (reason) => {
      if (reason !== "forced close") {
        return console.log(
          "PresentationPlayerPage: error to connect socket, " + reason
        );
      }
    });

    setWs(socket);
    return () => {
      socket.close();
    };
  }, []);

  return question ? (
    <BackgroundContainer>
      {ws ? (
        <Box sx={{ width: "90%", m: "auto" }}>
          <Paper
            elevation={10}
            sx={{
              // height: "100%",
              height: 600,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              p: 2
            }}
          >
            {isVoted ? (
              <Typography
                variant="h4"
                sx={{ mb: 5, alignItems: "center", justifyContent: "center" }}
              >
                You voted successfully
              </Typography>
            ) : (
              <Box>
                <Typography variant="h4" sx={{ mb: 5 }}>
                  {question.question}
                </Typography>
                <Grid
                  container
                  spacing={2}
                  style={{
                    maxHeight: "100vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "440px",

                    overflow: "auto"
                  }}
                >
                  {question.answers.map((value, index) => {
                    return (
                      <BasicButton
                        fullWidth
                        key={value.id}
                        variant="text"
                        onClick={() =>
                          handleSubmitChoice({ socket: ws, choiceId: value.id })
                        }
                      >
                        {value.des}
                      </BasicButton>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>
      ) : (
        ""
      )}

      <PopupMsg
        isOpen={!ws}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        {msgClose}
      </PopupMsg>
    </BackgroundContainer>
  ) : (
    ""
  );
};

export default PresentationPlayerPage;
