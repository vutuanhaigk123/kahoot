/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { useSearchParams } from "react-router-dom";
import { Badge, Box, Paper, Typography } from "@mui/material";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import { SUBMIT_STATUS } from "../../commons/constants";
import PopupMsg from "../../components/notification/PopupMsg";
import { ChatBubble, QuestionAnswer } from "@mui/icons-material";
import PlayerQuestionModal from "./modal/player/PlayerQuestionModal";
import usePopup from "./../../hooks/usePopup";
import ChatBox from "./modal/chat/ChatBox";
import { useSocket } from "../../context/socket-context";
import usePresentationPlayer from "../../hooks/socket/player/usePresentationPlayer";
import useToggle from "../../hooks/useToggle";
import PresentationChart from "../../components/chart/PresentationChart";
import { grey } from "@mui/material/colors";

const PresentationPlayerPage = () => {
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const slide = searchParam.get("slide");
  const {
    open: openQAModal,
    handleClosePopup: handleCloseQAPopup,
    handleOpenPopup: handleOpenQAPopup
  } = usePopup();
  const {
    open: openChat,
    handleOpenPopup: handleOpenChatPopup,
    handleClosePopup: handleCloseChatPopup
  } = usePopup();

  // Socket context
  const { socketContext, setSocketContext } = useSocket();

  const { isVoted, msgClose, question, ws, data, handleSubmitChoice } =
    usePresentationPlayer(socketContext, setSocketContext, id, slide);

  const { value: isNotify, toggleValue: toggleNotify } = useToggle(false);
  const { value: isNotifyQues, toggleValue: toggleNotifyQues } =
    useToggle(false);

  return (
    <BackgroundContainer>
      {ws && (question || isVoted) ? (
        <Paper
          elevation={10}
          sx={{
            minWidth: 300,
            maxWidth: "20vw",
            maxHeight: "70vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            p: 2,
            m: "auto"
          }}
        >
          {question ? (
            <Typography variant="h4">{question.question}</Typography>
          ) : null}

          {isVoted ? (
            <Box
              sx={{
                height: "50vh",
                width: "20vw",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <PresentationChart data={data} height={"100%"} />
            </Box>
          ) : (
            <>
              {/* Options container */}
              <Box
                sx={{
                  overflowY: "auto",
                  height: "70%",
                  border: 1,
                  p: 2,
                  borderRadius: 1,
                  borderColor: grey[300],
                  display: question.answers.length > 0 ? "flex" : "none",
                  flexDirection: "column",
                  gap: 2,
                  width: "90%",
                  mt: 2
                }}
              >
                {/* Options list */}
                {question.answers.map((value, index) => {
                  return (
                    <BasicButton
                      fullWidth
                      key={value.id}
                      variant="contained"
                      onClick={() =>
                        handleSubmitChoice({ socket: ws, choiceId: value.id })
                      }
                    >
                      {value.des}
                    </BasicButton>
                  );
                })}
              </Box>
            </>
          )}
          {/* Q&A button */}
          <Badge
            color="primary"
            variant="dot"
            invisible={!isNotifyQues}
            sx={{ mt: 2 }}
          >
            <BasicButton
              icon={<QuestionAnswer />}
              color="success"
              sx={{ width: "20vw" }}
              onClick={() => {
                handleOpenQAPopup();
                toggleNotifyQues(false);
              }}
            >
              Open Q&A
            </BasicButton>
          </Badge>
          {/* Chat button */}
          <Badge
            color="primary"
            variant="dot"
            invisible={!isNotify}
            sx={{ mt: 2 }}
          >
            <BasicButton
              icon={<ChatBubble />}
              color="success"
              sx={{ width: "20vw" }}
              onClick={() => {
                handleOpenChatPopup();
                toggleNotify(false);
              }}
            >
              Open chat
            </BasicButton>
          </Badge>

          {/* Q&A modal */}
          <PlayerQuestionModal
            isOpen={openQAModal}
            handleClosePopup={handleCloseQAPopup}
          ></PlayerQuestionModal>

          {/* Chat modal */}
          <ChatBox
            isOpen={openChat}
            handleClosePopup={handleCloseChatPopup}
            toggleNotify={toggleNotify}
          ></ChatBox>
        </Paper>
      ) : null}
      <PopupMsg
        isOpen={!ws || msgClose ? true : false}
        hasOk={false}
        status={SUBMIT_STATUS.ERROR}
        handleClosePopup={() => console.log()}
      >
        {msgClose}
      </PopupMsg>
    </BackgroundContainer>
  );
};

export default PresentationPlayerPage;
