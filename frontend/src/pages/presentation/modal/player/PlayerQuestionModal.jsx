import { ArrowBack, Close } from "@mui/icons-material";
import { Dialog, DialogContent, Stack } from "@mui/material";
import React, { useState } from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import BasicButton from "../../../../components/button/BasicButton";
import AskQuestion from "./components/AskQuestion";
import QuestionList from "../owner/components/QuestionList";
import Transition from "../components/Transition";
import { useSocket } from "../../../../context/socket-context";
import { WS_EVENT } from "../../../../commons/constants";

const PAGE = { LIST_PAGE: 0, ASK_PAGE: 1 };

const PlayerQuestionModal = ({ isOpen, handleClosePopup }) => {
  const { socketContext } = useSocket();
  const [quesHistory, setQuesHistory] = useState([]);
  const data = [
    { slideQuestion: "Câu hỏi slide", question: "Câu hỏi người chơi" },
    { slideQuestion: "Câu hỏi slide 2", question: "Câu hỏi người chơi 2" }
  ];

  const [curPage, setCurPage] = React.useState(PAGE.LIST_PAGE);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log("init connection event in question modal");
      });
      return () => {
        socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.RECEIVE_QUESTION_EVENT, (arg) => {
        setQuesHistory([...quesHistory, { ...arg }]);
        console.log(arg);
      });
      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
      };
    }
  }, [quesHistory, socketContext]);

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      fullWidth
    >
      <DialogContent
        sx={{
          display: "flex",
          padding: "10px 50px 10px 50px",
          gap: 2,
          maxHeight: "60vh",
          minHeight: "20vh",
          position: "relative",
          p: "5px 10px 20px 10px"
        }}
      >
        {/* Back button */}
        {curPage === PAGE.ASK_PAGE ? (
          <BasicButton
            icon={<ArrowBack />}
            variant="text"
            sx={{ position: "absolute" }}
            onClick={() => setCurPage(PAGE.LIST_PAGE)}
          >
            Back
          </BasicButton>
        ) : null}

        {/* Close button */}
        <Close
          sx={[
            { position: "absolute", top: 5, right: 5 },
            iconButton,
            iconHover("error.main")
          ]}
          onClick={handleClosePopup}
        />
        {/* <Carousel slides={data} /> */}
        <Stack
          sx={{
            width: "100%",
            gap: 2,
            m: "auto",
            textAlign: "center",
            mt: "10%"
          }}
        >
          {curPage === PAGE.LIST_PAGE ? (
            <QuestionList
              data={data}
              onClick={() => setCurPage(PAGE.ASK_PAGE)}
            />
          ) : (
            <AskQuestion returnToListPage={() => setCurPage(PAGE.LIST_PAGE)} />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerQuestionModal;
