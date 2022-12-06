/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { io } from "socket.io-client";
import { SUBMIT_STATUS } from "../../commons/constants";
import PresentationChart from "../../components/chart/PresentationChart";
import PopupMsg from "../../components/notification/PopupMsg";

const CREATE_ROOM_CMD = 5;
const room = -1;
const INIT_CONNECTION_EVENT = "1";
const EXIT_ROOM_EVENT = "-2";
const RECEIVE_CHOICE_EVENT = "-3";
const CLOSE_REASON = "-999";
const REASON_HAS_NEW_CONNECTION = "-998";
const REASON_NOT_FOUND_CONTENT = "-997";
const REASON_INVALID_CMD = "-995";
const REASON_WAITING_FOR_HOST = "-994";
const REASON_SLIDE_HAS_NO_ANS = "-993";

const toIndex = (dataChart, choiceId) => {
  console.log(dataChart);
  return dataChart.findIndex((choice) => choice.id === choiceId);
};

const PresentationOwnerPage = () => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [msgClose, setMsgClose] = useState("Not found content");
  const [question, setQuestion] = useState(null);

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
      query: `cmd=${CREATE_ROOM_CMD}&room=${id}&slide=${slide}`,
      withCredentials: true
    });

    socket.on(INIT_CONNECTION_EVENT, (arg) => {
      setIsConnected(true);
      setQuestion(arg.curQues.question);
      setData(arg.curQues.answers);
      console.log("==========================================");
      console.log(arg);
    });

    socket.on(CLOSE_REASON, (arg) => {
      console.log(
        "================= Closing connection signal from server ======================",
        arg
      );
      switch (arg) {
        case REASON_HAS_NEW_CONNECTION:
          setMsgClose("Only support 1 connection at a time");
          break;
        case REASON_NOT_FOUND_CONTENT:
          setMsgClose("Not found content");
          break;
        case REASON_WAITING_FOR_HOST:
          setMsgClose("Waiting for host present");
          break;
        case REASON_SLIDE_HAS_NO_ANS:
          console.log("slide has no answer");
        // eslint-disable-next-line no-fallthrough
        case REASON_INVALID_CMD:
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
      if (ws) socket.close();
    };
  }, []);

  React.useEffect(() => {
    if (ws) {
      ws.on(RECEIVE_CHOICE_EVENT, (arg) => {
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
      return () => ws.off(RECEIVE_CHOICE_EVENT);
    }
  }, [ws, data]);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {isConnected && id && slide ? (
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {question}
          </Typography>
          <PresentationChart data={data} />
        </Box>
      ) : (
        ""
      )}

      <PopupMsg
        isOpen={!isConnected && !ws}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        {msgClose}
      </PopupMsg>
    </Box>
  );
};

export default PresentationOwnerPage;
