import { Check, Close, QuestionMark } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import Carousel from "./components/Carousel";
import Transition from "./../components/Transition";

const OwnerQuestionModal = ({ isOpen, handleClosePopup }) => {
  const data = [
    { slideQuestion: "Câu hỏi slide", question: "Câu hỏi người chơi" },
    { slideQuestion: "Câu hỏi slide 2", question: "Câu hỏi người chơi 2" }
  ];

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
            <Box>
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
