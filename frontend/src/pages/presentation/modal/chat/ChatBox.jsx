import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import React from "react";
import { Close, Send } from "@mui/icons-material";
import { iconButton, iconHover } from "./../../../../commons/globalStyles";
import Transition from "../components/Transition";
import TextBox from "./../../../../components/input/TextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSocket } from "../../../../context/socket-context";
import { WS_CMD } from "../../../../commons/constants";
import useChat from "./../../../../hooks/socket/useChat";
import { useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import "./ChatBox.css";

const ChatBox = ({ isOpen, handleClosePopup, toggleNotify }) => {
  const { user } = useSelector((state) => state.auth);
  const { socketContext } = useSocket();
  const { chatHistory } = useChat(socketContext, toggleNotify, isOpen);
  const schema = yup.object({
    msg: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    socketContext.emit(WS_CMD.SEND_CMT_CMD, data.msg);
    reset();
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClosePopup}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent
        sx={{
          display: "flex",
          p: 3,
          gap: 2,
          height: "60vh",
          position: "relative"
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
        <Stack sx={{ mt: 4, width: "100%", height: "100% - 4" }}>
          {/* Chat view area */}
          <ScrollToBottom
            className="chat-view"
            followButtonClassName="scroll-button"
          >
            {chatHistory.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  width: "100%",
                  flexDirection:
                    user.data.id === item.userId ? "row-reverse" : "row"
                }}
              >
                {/* Avatar + name */}
                <Tooltip title={item.name}>
                  <Avatar />
                </Tooltip>
                {/* Text */}
                <Box>
                  <Typography variant="caption">{item.name}</Typography>
                  <Typography
                    sx={{
                      border: 1,
                      p: 1,
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </ScrollToBottom>
          {/* Chat send area */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextBox
                fullWidth
                placeholder="Type message here"
                helperText={errors.msg ? errors.msg.message : ""}
                name="msg"
                control={control}
              />
              <Box>
                <IconButton type="submit" sx={{ p: 0 }}>
                  <Send
                    sx={[
                      {
                        "&:hover": {
                          bgcolor: "primary.main",
                          color: "white"
                        },
                        mt: "2px"
                      },
                      iconButton
                    ]}
                  />
                </IconButton>
              </Box>
            </Box>
          </form>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBox;
