import { Check, Close, QuestionMark } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import Carousel from "./components/Carousel";
import Transition from "./../components/Transition";
import { useSocket } from "../../../../context/socket-context";
import { WS_EVENT } from "../../../../commons/constants";

const OwnerQuestionModal = ({ isOpen, handleClosePopup }) => {
  const data = [
    { slideQuestion: "Câu hỏi slide", question: "Câu hỏi người chơi" },
    { slideQuestion: "Câu hỏi slide 2", question: "Câu hỏi người chơi 2" }
  ];
  const { socketContext } = useSocket();
  const [quesHistory, setQuesHistory] = useState([]);

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
      maxWidth="lg"
    >
      <DialogContent
        sx={{
          display: "flex",
          padding: "10px 50px 10px 50px",
          gap: 2,
          height: "60vh",
          position: "relative",
          p: "5px 10px 5px 10px"
        }}
      >
        {/* Close button */}
        <Close
          sx={[
            { position: "absolute", top: 5, right: 5 },
            iconButton,
            iconHover("error.main")
          ]}
          onClick={handleClosePopup}
        />
        {/* Sidebar */}
        <Stack sx={{ width: "20%", gap: 2 }}>
          {data.map((item) => (
            <Box key={item.question}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <QuestionMark />
                {/* <Check /> */}
                <Typography variant="h6">{item.question}</Typography>
              </Box>
              <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
        <Carousel slides={data} />
      </DialogContent>
    </Dialog>
  );
};

export default OwnerQuestionModal;
