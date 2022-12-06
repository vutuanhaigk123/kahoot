/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { io } from "socket.io-client";
import { useState } from "react";
import { Box } from "@mui/material";

const room = -1;
const JOIN_ROOM_CMD = "2";
const INIT_CONNECTION_EVENT = "1";
const EXIT_ROOM_EVENT = "-2";
const SUBMIT_CHOICE_EVENT = "3";
const RECEIVE_CHOICE_EVENT = "-3";

const handleSubmitChoice = ({ socket, choiceId }) => {
  if (socket) {
    socket.emit(SUBMIT_CHOICE_EVENT, choiceId);
  } else {
    console.log("Not connected to server");
  }
};

const PresentationPlayerPage = () => {
  const [ws, setWs] = useState(null);
  const [question, setQuestion] = useState(null);
  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }

    const socket = io(wsDomain, {
      query: `cmd=${JOIN_ROOM_CMD}&room=${room}`,
      withCredentials: true
    });
    socket.on(INIT_CONNECTION_EVENT, (arg) => {
      console.log("==========================================");
      console.log(arg);
      setQuestion(arg.curQues);
    });

    socket.on(RECEIVE_CHOICE_EVENT, (arg) => {
      console.log(
        "=====================Another member has make a choice====================="
      );
      console.log(arg);
    });

    setWs(socket);
    return () => {
      if (ws) socket.close();
    };
  }, []);

  return question ? (
    <div>
      <Box>{question.title}</Box>
      {question.answers.map((value, index) => {
        console.log(value);
        return (
          <BasicButton
            variant="text"
            onClick={() =>
              handleSubmitChoice({ socket: ws, choiceId: value.id })
            }
          >
            {value.des}
          </BasicButton>
        );
      })}
    </div>
  ) : (
    ""
  );
};

export default PresentationPlayerPage;
