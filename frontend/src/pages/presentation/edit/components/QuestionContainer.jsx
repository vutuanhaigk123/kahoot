import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStatus from "../../../../hooks/useStatus";
import usePopup from "../../../../hooks/usePopup";
import { handlePost } from "../../../../utils/fetch";
import { API } from "../../../../commons/constants";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit, SaveAs } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import TextBox from "../../../../components/input/TextBox";
import PopupMsg from "../../../../components/notification/PopupMsg";
import useToggle from "../../../../hooks/useToggle";

const iconButton = {
  bgcolor: grey[300],
  borderRadius: "50%",
  color: "black",
  p: "5px"
};

const QuestionContainer = ({ presentation, slideIndex, refetch }) => {
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

  // Handle edit
  const { status, handleStatus } = useStatus();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const { value: disabled, toggleValue: toggleTextBox } = useToggle(true);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleToggle = () => {
    toggleTextBox();
    setIsEdit((prv) => !prv);
  };
  const onSubmit = async (data) => {
    // Add more data to post
    data.presentationId = presentation._id;
    data.slideId = presentation.slides[slideIndex]._id;
    const resp = await handlePost(API.UPDATE_SLIDE, data);
    console.log("🚀 ~ file: QuestionContainer.jsx:52 ~ onSubmit ~ resp", resp);

    handleStatus(resp); // update popup msg status
    handleOpenPopup(); // Open popup
    setIsLoading(false);
    handleToggle(); // Re-disable textbox
    refetch(); // Refetch data
  };

  React.useEffect(() => {
    if (presentation._id && presentation.slides.length > 0) {
      reset({ question: presentation.slides[slideIndex].question });
    }
  }, [presentation, reset, slideIndex]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Question */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Your question
          </Typography>
          {isEdit ? (
            <Box sx={{ position: "relative" }}>
              {isLoading && (
                <CircularProgress
                  size={34}
                  sx={{
                    top: "-2px",
                    right: "-2px",
                    color: "success.light",
                    position: "absolute"
                  }}
                />
              )}
              <IconButton type="submit" sx={{ p: 0 }}>
                <SaveAs
                  sx={[
                    {
                      "&:hover": {
                        bgcolor: "success.main",
                        color: "white"
                      }
                    },
                    iconButton
                  ]}
                  fontSize="small"
                />
              </IconButton>
            </Box>
          ) : (
            <Edit
              sx={[
                {
                  "&:hover": {
                    bgcolor: "warning.light",
                    color: "white"
                  }
                },
                iconButton
              ]}
              fontSize="small"
              onClick={handleToggle}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            m: "10px 0 10px 0",
            alignItems: "start",
            gap: 1
          }}
        >
          <TextBox
            size="small"
            placeholder="Enter your question"
            helperText={errors.question ? errors.question.message : " "}
            defaultValue={
              presentation._id ? presentation.slides[slideIndex].question : ""
            }
            name="question"
            control={control}
            disabled={disabled}
          ></TextBox>
        </Box>
      </form>
      {/* Popup message on update question */}
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
        hideOnSuccess={true}
      >
        {status.msg}
      </PopupMsg>
    </>
  );
};

export default QuestionContainer;
