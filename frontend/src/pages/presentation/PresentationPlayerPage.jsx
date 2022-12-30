/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import BasicButton from "../../components/button/BasicButton";
import { useSearchParams } from "react-router-dom";
import { Badge, Box, Paper, Typography } from "@mui/material";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import { questionType, SUBMIT_STATUS } from "../../commons/constants";
import PopupMsg from "../../components/notification/PopupMsg";
import { ChatBubble, QuestionAnswer } from "@mui/icons-material";
import PlayerQuestionModal from "./modal/player/PlayerQuestionModal";
import usePopup from "./../../hooks/usePopup";
import ChatBox from "./modal/chat/ChatBox";
import { useSocket } from "../../context/socket-context";
import usePresentationPlayer from "../../hooks/socket/player/usePresentationPlayer";
import useToggle from "../../hooks/useToggle";
import { grey } from "@mui/material/colors";
import PresentationType from "./components/PresentationType";

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
    data,
    handleSubmitChoice,
    isEndPresent,
    curQuesType
  } = usePresentationPlayer(socketContext, setSocketContext, id, slide);

  const { value: isNotify, toggleValue: toggleNotify } = useToggle(false);

  return (
    <BackgroundContainer>
      {ws && (question || isVoted) ? (
        <Paper
          elevation={10}
          sx={{
            minWidth:
              isVoted === false && curQuesType === questionType.MULTIPLE_CHOICE
                ? 300
                : "70vw",
            maxWidth:
              isVoted === false && curQuesType === questionType.MULTIPLE_CHOICE
                ? "20vw"
                : "70vw",
            maxHeight: "70vh",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            p: 2,
            m: "auto"
          }}
        >
          {curQuesType === questionType.MULTIPLE_CHOICE ? (
            <Typography variant="h4">{question}</Typography>
          ) : null}

          {isVoted || curQuesType !== questionType.MULTIPLE_CHOICE ? (
            <Box
              sx={{
                maxHeight: "50vh",
                height:
                  curQuesType === questionType.MULTIPLE_CHOICE
                    ? "50vh"
                    : "50vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 1
              }}
            >
              <PresentationType
                curQuesType={curQuesType}
                data={data}
                question={question}
              />
            </Box>
          ) : (
            <>
              {curQuesType === questionType.MULTIPLE_CHOICE ? (
                <>
                  {data.length === 0 ? (
                    <Typography variant="h6">
                      There is no answers yet
                    </Typography>
                  ) : null}
                  {/* Options container */}
                  <Box
                    sx={{
                      overflowY: "auto",
                      height: "70%",
                      border: 1,
                      p: 2,
                      borderRadius: 1,
                      borderColor: grey[300],
                      display: data.length > 0 ? "flex" : "none",
                      flexDirection: "column",
                      gap: 2,
                      width: "90%",
                      mt: 2
                    }}
                  >
                    {/* Options list */}
                    {data.map((value, index) => {
                      return (
                        <BasicButton
                          fullWidth
                          key={value.id}
                          variant="contained"
                          onClick={() =>
                            handleSubmitChoice({
                              socket: ws,
                              choiceId: value.id
                            })
                          }
                        >
                          {value.des}
                        </BasicButton>
                      );
                    })}
                  </Box>
                </>
              ) : null}
            </>
          )}
          {/* Q&A button */}
          <BasicButton
            icon={<QuestionAnswer />}
            color="success"
            sx={{ width: "20vw", mt: 2 }}
            onClick={handleOpenQAPopup}
          >
            Open Q&A
          </BasicButton>
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
      <div className="modal-player">
        {/* Connection modal */}
        <PopupMsg
          isOpen={!ws || msgClose ? true : false}
          // hasOk={false}
          status={SUBMIT_STATUS.ERROR}
          handleClosePopup={() => console.log()}
          navOnErr={true}
        >
          {msgClose}
        </PopupMsg>
        {/* End presentation modal */}
        <PopupMsg
          isOpen={isEndPresent}
          status={SUBMIT_STATUS.ERROR}
          handleClosePopup={() => console.log()}
          navOnErr={true}
        >
          Presentation ended by the host
        </PopupMsg>
      </div>
    </BackgroundContainer>
  );
};

export default PresentationPlayerPage;
