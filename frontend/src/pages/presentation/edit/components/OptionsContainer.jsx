import { AddCircle, Close, Edit, SaveAs } from "@mui/icons-material";
import {
  Typography,
  TextField,
  CircularProgress,
  IconButton
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { API } from "../../../../commons/constants";
import BasicButton from "../../../../components/button/BasicButton";
import PopupForm from "../../../../components/notification/PopupForm";
import PopupMsg from "../../../../components/notification/PopupMsg";
import usePopup from "../../../../hooks/usePopup";
import useStatus from "../../../../hooks/useStatus";
import { handlePost } from "../../../../utils/fetch";
import useToggle from "./../../../../hooks/useToggle";
import * as yup from "yup";
import TextBox from "../../../../components/input/TextBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const OptionsContainer = ({ answers, slideIndex, refetch }) => {
  const presentation = useSelector((state) => state.presentation);

  // Create answer
  const {
    open: openAnswerCreatePopup,
    handleOpenPopup: handleOpenAnswerCreatePopup,
    handleClosePopup: handleCloseAnswerCreatePopup
  } = usePopup();

  // Delete answer
  const { status, handleStatus } = useStatus();
  const {
    open: openAnswerDeletePopup,
    handleOpenPopup: handleOpenAnswerDeletePopup,
    handleClosePopup: handleCloseAnswerDeletePopup
  } = usePopup();
  const handleDelete = async (answerId) => {
    // Create data to post
    const data = {
      answerId,
      presentationId: presentation._id,
      slideId: presentation.slides[slideIndex]._id
    };
    const resp = await handlePost(API.DELETE_ANSWER, data);
    console.log(
      "🚀 ~ file: OptionsContainer.jsx:33 ~ handleDelete ~ resp",
      resp
    );

    handleStatus(resp);
    handleOpenAnswerDeletePopup(); // Open popup
    refetch(); // Refetch data
  };

  // Edit answer
  const { status: editStatus, handleStatus: handleEditStatus } = useStatus();
  const {
    open: openAnswerUpdatePopup,
    handleOpenPopup: handleOpenAnswerUpdatePopup,
    handleClosePopup: handleCloseAnswerUpdatePopup
  } = usePopup();
  const handleEdit = async (answerId, answer) => {
    // Create data to post
    const data = {
      answerId,
      presentationId: presentation._id,
      slideId: presentation.slides[slideIndex]._id,
      answer
    };
    const resp = await handlePost(API.UPDATE_ANSWER, data);

    handleEditStatus(resp);
    handleOpenAnswerUpdatePopup(); // Open popup
    refetch(); // Refetch data
  };

  return (
    <>
      {/* Options */}
      <Typography variant="h6" fontWeight="bold">
        Options
      </Typography>
      {answers.map((answer, index) => {
        return (
          <Box
            key={answer._id}
            sx={{
              display: "flex",
              m: "10px 0 10px 0",
              alignItems: "start",
              gap: 1
            }}
          >
            <AnswerTextBox
              answer={answer}
              answerIndex={index}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </Box>
        );
      })}
      <BasicButton
        onClick={handleOpenAnswerCreatePopup}
        icon={<AddCircle />}
        fullWidth
      >
        Add option
      </BasicButton>
      {/* Popup form add answer */}
      <PopupForm
        isOpen={openAnswerCreatePopup}
        handleClose={handleCloseAnswerCreatePopup}
        refetch={refetch}
        api={API.ADD_ANSWER}
        header="Please enter your option"
        label="Option"
        fieldName="answer"
        otherField={{
          presentationId: presentation._id,
          slideId: presentation.slides[slideIndex]._id
        }}
      />
      {/* Delete answer popup */}
      <PopupMsg
        status={status.type}
        isOpen={openAnswerDeletePopup}
        handleClosePopup={handleCloseAnswerDeletePopup}
        hideOnSuccess={true}
      >
        {status.msg}
      </PopupMsg>
      {/* Update answer popup */}
      <PopupMsg
        status={editStatus.type}
        isOpen={openAnswerUpdatePopup}
        handleClosePopup={handleCloseAnswerUpdatePopup}
        hideOnSuccess={true}
      >
        {editStatus.msg}
      </PopupMsg>
    </>
  );
};

const iconButton = {
  bgcolor: grey[300],
  borderRadius: "50%",
  color: "black",
  p: "5px",
  marginTop: "6px"
};

const AnswerTextBox = ({ answer, answerIndex, handleEdit, handleDelete }) => {
  const { value: disabled, toggleValue: toggleTextBox } = useToggle(true);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // textbox validation
  const schema = yup.object({
    answer: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => {
    handleEdit(answer._id, data.answer);
  };

  const handleToggle = () => {
    toggleTextBox();
    setIsEdit((prv) => !prv);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          width: "100%",
          gap: "5px",
          alignItems: "start"
        }}
      >
        <TextBox
          size="small"
          defaultValue={answer.des}
          fullWidth
          placeholder={`Options ${answerIndex}`}
          disabled={disabled}
          control={control}
          name="answer"
          helperText={errors.answer ? errors.answer.message : " "}
        />
        {isEdit ? (
          <Box sx={{ position: "relative" }}>
            {isLoading && (
              <CircularProgress
                size={35}
                sx={{
                  top: "3px",
                  right: "-3px",
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
      </form>

      <Close
        sx={[
          {
            "&:hover": { bgcolor: "error.main", color: "white" }
          },
          iconButton
        ]}
        fontSize="small"
        onClick={() => handleDelete(answer._id)}
      />
    </>
  );
};

export default OptionsContainer;
