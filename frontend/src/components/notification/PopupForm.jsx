import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import TextBox from "../input/TextBox";
import { API, SUBMIT_STATUS } from "../../commons/constants";
import PopupMsg from "./PopupMsg";
import usePopup from "./../../hooks/usePopup";

const PopupForm = ({ isOpen, handleClose, refetch }) => {
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
    console.log("🚀 ~ file: PopupForm.jsx ~ line 34 ~ onSubmit ~ data", data);
    try {
      const resp = await axios.post(API.CREATE_GROUP, data);
      console.log("🚀 ~ file: PopupForm.jsx ~ line 34 ~ onSubmit ~ resp", resp);
      // Handle submit
      if (resp?.data.status !== 0) {
        setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.data.message });
      } else {
        setStatus({
          type: SUBMIT_STATUS.SUCCESS,
          msg: "Group created successfully"
        });
      }
      // Close current popup form
      handleClose();
      // Open popup message
      handleOpenMsg();
      // Refetch groups data
      refetch();
    } catch (error) {
      console.log(
        "🚀 ~ file: PopupForm.jsx ~ line 35 ~ onSubmit ~ error",
        error
      );
    }
  };

  return (
    <>
      {/* Close form when recieved resp */}
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>What will we call your group ?</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextBox
              required
              variant="standard"
              label="Group's name"
              type="text"
              placeholder="Enter your group name"
              helperText={errors.name ? errors.name.message : null}
              name="name"
              control={control}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
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
