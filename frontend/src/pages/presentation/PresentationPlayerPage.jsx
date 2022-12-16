/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { useSearchParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
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

  const {
    isVoted,
    msgClose,
    question,
    ws,
    handleSubmitChoice,
    handleSendComment,
    handleSendQuestion
  } = usePresentationPlayer(socketContext, setSocketContext, id, slide);

  const { value: isNotify, toggleValue: toggleNotify } = useToggle(false);

  return (
    <BackgroundContainer>
      {ws && question ? (
        <Paper
          elevation={10}
          sx={{
            height: "70vh",
            maxHeight: "700px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            p: 2,
            m: "auto"
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
            <>
              <Typography variant="h4" sx={{ mb: 5 }}>
                {question.question}
              </Typography>
              <Box
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
                      variant="contained"
                      onClick={() =>
                        handleSubmitChoice({ socket: ws, choiceId: value.id })
                      }
                      sx={{ mb: 2 }}
                    >
                      {value.des}
                    </BasicButton>
                  );
                })}
              </Box>
            </>
          )}
          <BasicButton
            icon={<QuestionAnswer />}
            color="success"
            sx={{ mt: 2, width: "50%" }}
            onClick={handleOpenQAPopup}
          >
            Open Q&A
          </BasicButton>
          <BasicButton
            icon={<ChatBubble />}
            color="success"
            sx={{ mt: 2, width: "50%" }}
            onClick={handleOpenChatPopup}
          >
            Open chat
          </BasicButton>

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
          <BasicButton
            onClick={() => handleSendComment(ws, "Day la chat test")}
          >
            Send chat
          </BasicButton>
          <BasicButton
            onClick={() => handleSendQuestion(ws, "Day la question test")}
          >
            Send question
          </BasicButton>
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
