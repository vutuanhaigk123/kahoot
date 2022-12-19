import React from "react";
import usePopup from "../../../../hooks/usePopup";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { handlePost } from "../../../../utils/fetch";
import { API } from "../../../../commons/constants";
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
import SelectField from "./../../../../components/input/SelectField";
import { useParams } from "react-router-dom";
import Transition from "./../../modal/components/Transition";

const options = [
  {
    value: 0,
    label: "Multiple choice"
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
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { status, handleStatus } = useStatus();
  const { id: presentationId } = useParams();
  const onSubmit = async (data) => {
    // Process data
    data.presentationId = presentationId;

    // Handle submit
    const resp = await handlePost(API.CREATE_SLIDE, data);
    handleStatus(resp, "");

    // Close current popup form
    handleClose();
    // Open popup message
    handleOpenMsg();
    // Refetch groups data
    refetch();
  };

  return (
    <>
      {/* Close form when recieved resp */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Slide options</DialogTitle>
        <DialogContent style={{ paddingTop: "10px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextBox
              label="Question"
              type="text"
              helperText={errors.question ? errors.question.message : " "}
              name="question"
              control={control}
            />
            <SelectField
              label="Question's type"
              select
              // helperText={errors.question ? errors.question.message : " "}
              defaultValue={options[0].value}
              name="type"
              control={control}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </SelectField>
            <DialogActions sx={{ justifyContent: "center" }}>
              <BasicButton onClick={handleClose}>Cancel</BasicButton>
              <BasicButton type="submit">Create</BasicButton>
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
