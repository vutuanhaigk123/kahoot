import React from "react";
import TextBox from "../../../../../components/input/TextBox";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicButton from "../../../../../components/button/BasicButton";
import { Box, Typography } from "@mui/material";
import { useSocket } from "../../../../../context/socket-context";
import { WS_CMD } from "../../../../../commons/constants";

const AskQuestion = () => {
  const { socketContext } = useSocket();
  // Form
  const schema = yup.object({
    question: yup.string().trim().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => {
    // Handle popup msg
    if (socketContext) {
      socketContext.emit(WS_CMD.SEND_QUESTION_CMD, data.question);
    }
  };

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ display: "flex", fontWeight: "600" }}
      >
        Write your questions here
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextBox
          helperText={errors.question ? errors.question.message : null}
          name="question"
          placeholder="Your question"
          multiline
          maxRows={4}
          size="large"
          control={control}
        />
        <BasicButton type="submit" sx={{ mt: 2, width: "100%" }}>
          Submit
        </BasicButton>
      </form>
    </Box>
  );
};

export default AskQuestion;
