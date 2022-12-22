import React from "react";
import usePopup from "../../../../hooks/usePopup";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { handlePost } from "../../../../utils/fetch";
import { API, questionType } from "../../../../commons/constants";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  MenuItem
} from "@mui/material";
import TextBox from "../../../../components/input/TextBox";
import BasicButton from "../../../../components/button/BasicButton";
import PopupMsg from "../../../../components/notification/PopupMsg";
import useStatus from "../../../../hooks/useStatus";
import { useParams } from "react-router-dom";
import Transition from "./../../modal/components/Transition";

const options = [
  {
    value: questionType.MULTIPLE_CHOICE,
    label: "Multiple choice"
  },
  {
    value: questionType.HEADING,
    label: "Heading"
  },
  {
    value: questionType.PARAGRAPH,
    label: "Paragraph"
  }
];

const CreateSlideForm = ({ isOpen, handleClose, refetch }) => {
  const {
    open: openMsg,
    handleClosePopup: handleCloseMsg,
    handleOpenPopup: handleOpenMsg
  } = usePopup();

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
  const { id: presentationId } = useParams();
  const [isCreating, setIsCreating] = React.useState(false);
  const onSubmit = async (data) => {
    setIsCreating(true);
    // Process data
    data.presentationId = presentationId;

    // Handle submit
    console.log(data);
    var resp = null;
    switch (data.type) {
      case questionType.MULTIPLE_CHOICE:
        resp = await handlePost(API.CREATE_SLIDE, data);

        break;
      case questionType.HEADING:
        // resp = await handlePost(API.CREATE_SLIDE, data);
        break;
      case questionType.PARAGRAPH:
        // resp = await handlePost(API.CREATE_SLIDE, data);
        break;

      default:
        console.log("Incorrect question type");
        break;
    }

    //  Handle resp status
    if (resp) {
      console.log("handle");
      handleStatus(resp);
    }

    // Open error popup message if exist
    handleOpenMsg();
    // Refetch slides data
    refetch();
    // Close current popup form
    handleClose();
    reset();

    setIsCreating(false);
  };

  return (
    <>
      {/* Close form when recieved resp */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Slide options</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: 10 }}>
            <TextBox
              label="Question"
              type="text"
              helperText={errors.question ? errors.question.message : ""}
              name="question"
              control={control}
            />
            <TextBox
              label="Question's type"
              select
              defaultValue={options[0].value}
              name="type"
              control={control}
              fullWidth
              sx={{ mt: 2 }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextBox>
            <DialogActions sx={{ justifyContent: "center" }}>
              <BasicButton onClick={handleClose}>Cancel</BasicButton>
              <BasicButton type="submit" loading={isCreating}>
                Create
              </BasicButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <PopupMsg
        status={status.type}
        isOpen={openMsg}
        handleClosePopup={handleCloseMsg}
        hideOnSuccess={true}
      >
        {status.msg}
      </PopupMsg>
    </>
  );
};

export default CreateSlideForm;
