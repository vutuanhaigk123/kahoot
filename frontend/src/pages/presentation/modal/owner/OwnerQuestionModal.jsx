/* eslint-disable react-hooks/exhaustive-deps */
import { Check, Close, QuestionMark } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import Carousel from "./components/Carousel";
import Transition from "./../components/Transition";
import { useSocket } from "../../../../context/socket-context";
import { SORT_BY, SORT_BY_ARR, WS_EVENT } from "../../../../commons/constants";
import { useSelector } from "react-redux";

const sortBy = (originalData, sortType) => {};

const OwnerQuestionModal = ({ isOpen, handleClosePopup, toggleNotify }) => {
  const { user } = useSelector((state) => state?.auth);
  const { socketContext } = useSocket();
  const [quesHistory, setQuesHistory] = useState([]);

  const [sortBy, setSortBy] = useState(SORT_BY.TIME_ASKED_ASC);
  const handleChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);
  };

  React.useEffect(() => {
    if (socketContext) {
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log("init connection event in question modal");
        console.log(arg);
        setQuesHistory(arg.quesHistory);
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
        if (user.data.id !== arg.userId && !isOpen) {
          toggleNotify();
        }
      });

      socketContext.on(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT, (arg) => {
        const quesHisTmp = [...quesHistory];
        const quesAnswered = quesHisTmp.find((ques) => ques.id === arg);
        console.log(quesAnswered);
        if (quesAnswered) {
          quesAnswered.isAnswered = true;
          setQuesHistory(quesHisTmp);
        }
      });

      return () => {
        socketContext.off(WS_EVENT.RECEIVE_QUESTION_EVENT);
        socketContext.off(WS_EVENT.RECEIVE_MARK_QUES_ANSWERED_EVENT);
      };
    }
  }, [isOpen, quesHistory, socketContext]);

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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              label="Sort by"
              onChange={handleChange}
            >
              {SORT_BY_ARR.map((sortType, key) => {
                return (
                  <MenuItem key={key} value={sortType.value}>
                    {sortType.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {quesHistory.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {item.isAnswered ? <Check /> : <QuestionMark />}
                {/* <Check /> */}
                <Typography variant="h6">{item.content}</Typography>
              </Box>
              <Divider orientation="horizontal" flexItem sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
        <Carousel slides={quesHistory} />
      </DialogContent>
    </Dialog>
  );
};

export default OwnerQuestionModal;
