import { Paper, Typography } from "@mui/material";
import React from "react";
import TextBox from "../../../../components/input/TextBox";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicButton from "../../../../components/button/BasicButton";
import { AddCircle, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import { Cancel } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { API } from "../../../../commons/constants";
import { handlePost } from "./../../../../utils/fetch";
import useStatus from "../../../../hooks/useStatus";
import PopupMsg from "../../../../components/notification/PopupMsg";
import usePopup from "../../../../hooks/usePopup";
import PopupForm from "./../../../../components/notification/PopupForm";

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

  // const handleChange = (onChangeValue, i) => {
  //   const inputdata = [...options];
  //   inputdata[i] = onChangeValue.target.value;
  //   setOptions(inputdata);
  // };

  // Add answer popup
  const {
    open: openAnswerPopup,
    handleOpenPopup: handleOpenAnswerPopup,
    handleClosePopup: handleCloseAnswerPopup
  } = usePopup();

  const handleDelete = (index) => {
    console.log(index);
  };

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

            {/* Options */}
            <Typography variant="h6" fontWeight="bold">
              Options
            </Typography>
            {presentation.slides[slideIndex].answers.map((item, index) => {
              return (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    m: "10px 0 10px 0",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <TextBox
                    // onChange={(e) => handleChange(e, index)}
                    size="small"
                    defaultValue={item.des}
                    placeholder={`Options ${index}`}
                    name={item._id}
                    control={control}
                  />
                  <Cancel onClick={() => handleDelete(index)} />
                </Box>
              );
            })}
            <BasicButton
              onClick={handleOpenAnswerPopup}
              icon={<AddCircle />}
              fullWidth
            >
              Add option
            </BasicButton>
          </form>
          {/* Popup form add answer */}
          <PopupForm
            isOpen={openAnswerPopup}
            handleClose={handleCloseAnswerPopup}
            refetch={refetch}
            api={API.ADD_ANSWER}
            header="Please enter your option"
            label="Option"
            fieldName="answer"
            otherField={{
              presentationId: presentation._id,
              slideId: presentation.slides[slideIndex]._id
            }}
          ></PopupForm>
        </>
      ) : (
        <Typography>Please add slide to edit</Typography>
      )}

      {/* Popup message on delete */}
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
