import { Paper, Typography } from "@mui/material";
import React from "react";
import TextBox from "../../../../components/input/TextBox";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicButton from "../../../../components/button/BasicButton";
import { Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { API } from "../../../../commons/constants";
import { handlePost } from "./../../../../utils/fetch";
import useStatus from "../../../../hooks/useStatus";
import PopupMsg from "../../../../components/notification/PopupMsg";
import usePopup from "../../../../hooks/usePopup";
import OptionsContainer from "./OptionsContainer";

const EditArea = ({ slideIndex, refetch }) => {
  // Form
  const schema = yup.object({
    question: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { status, handleStatus } = useStatus();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const onSubmit = async (data) => {
    // Add more data to post
    data.presentationId = presentation._id;
    data.slideId = presentation.slides[slideIndex]._id;
    console.log("🚀 ~ file: EditArea.jsx:43 ~ onSubmit ~ data", data);
    const resp = await handlePost(API.UPDATE_SLIDE, data);

    handleStatus(resp, "Save success"); // update popup msg status
    handleOpenPopup(); // Open popup
    refetch(); // Refetch data
  };

  const presentation = useSelector((state) => state.presentation);

  React.useEffect(() => {
    if (presentation._id && presentation.slides.length > 0) {
      reset({ question: presentation.slides[slideIndex].question });
    }
  }, [presentation, reset, slideIndex]);

  return (
    <Paper
      elevation={10}
      sx={{
        maxHeight: "400px",
        width: "100%",
        p: 2,
        overflowY: "scroll"
      }}
    >
      {presentation._id && presentation.slides.length > 0 ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Save button */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Edit
                sx={{
                  // border: 1,
                  bgcolor: grey[300],
                  borderRadius: "50%",
                  p: "5px"
                }}
              />
              <BasicButton type="submit">Save</BasicButton>
            </Box>
            {/* Question */}
            <Typography variant="h6" fontWeight="bold">
              Your question
            </Typography>
            <TextBox
              placeholder="Enter your question"
              helperText={errors.question ? errors.question.message : " "}
              defaultValue={
                presentation._id ? presentation.slides[slideIndex].question : ""
              }
              name="question"
              control={control}
            ></TextBox>
          </form>
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

      {/* Popup message on update question */}
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
      >
        {status.msg}
      </PopupMsg>
    </Paper>
  );
};

export default EditArea;
