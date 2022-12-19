import { Help } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import Transition from "../../pages/presentation/modal/components/Transition";
import BasicButton from "./../button/BasicButton";

const ConfirmPopup = ({ isOpen, handleClose, handleDelete, isDeleting }) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogContent sx={{ p: 2 }}>
        <Stack>
          <Help sx={{ fontSize: "60px", alignSelf: "center" }}></Help>
          <Typography>Are you sure you want to delete</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: "auto" }}>
        <BasicButton
          variant="contained"
          color="error"
          onClick={handleDelete}
          loading={isDeleting}
        >
          Yes
        </BasicButton>
        <BasicButton variant="contained" onClick={handleClose}>
          No
        </BasicButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPopup;
