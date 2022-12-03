import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextBox from "../input/TextBox";
import { SUBMIT_STATUS } from "../../commons/constants";
import PopupMsg from "./PopupMsg";
import usePopup from "./../../hooks/usePopup";
import { handlePost } from "./../../utils/fetch";
import BasicButton from "./../button/BasicButton";

const PopupForm = ({ isOpen, handleClose, refetch, header, label, api }) => {
  const {
    open: openMsg,
    handleClosePopup: handleCloseMsg,
    handleOpenPopup: handleOpenMsg
  } = usePopup();

  // Form
  const [status, setStatus] = React.useState({});
  const schema = yup.object({
    name: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    const resp = await handlePost(api, data);
    console.log("🚀 ~ file: PopupForm.jsx ~ line 34 ~ onSubmit ~ resp", resp);
    // Handle submit
    if (resp?.status !== 0) {
      setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.message });
    } else {
      setStatus({
        type: SUBMIT_STATUS.SUCCESS,
        msg: "Created successfully"
      });
    }
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
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextBox
              variant="standard"
              label={label}
              type="text"
              placeholder="Enter your group name"
              helperText={errors.name ? errors.name.message : " "}
              name="name"
              control={control}
            />
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
      >
        {status.msg}
      </PopupMsg>
    </>
  );
};

export default PopupForm;
