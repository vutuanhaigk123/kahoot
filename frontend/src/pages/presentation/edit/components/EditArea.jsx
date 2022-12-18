import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import OptionsContainer from "./OptionsContainer";
import QuestionContainer from "./QuestionContainer";

const EditArea = ({ slideIndex, refetch }) => {
  const presentation = useSelector((state) => state.presentation);

  return (
    <Paper
      elevation={10}
      sx={{
        maxHeight: "60vh",
        p: 2,
        overflowY: "scroll",
        textAlign: "center"
      }}
    >
      {presentation._id && presentation.slides.length > 0 ? (
        <>
          {/* Question */}
          <QuestionContainer
            presentation={presentation}
            refetch={refetch}
            slideIndex={slideIndex}
          ></QuestionContainer>
          {/* Options */}
          <OptionsContainer
            answers={presentation.slides[slideIndex].answers}
            refetch={refetch}
            slideIndex={slideIndex}
          ></OptionsContainer>
        </>
      ) : (
        <Typography>Please add slide to edit</Typography>
      )}
    </Paper>
  );
};

export default EditArea;
