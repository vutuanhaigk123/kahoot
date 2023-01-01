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

const ConfirmPopup = ({
  isOpen,
  handleClose,
  handleConfirm,
  handleRedirect = handleClose,
  isConfirming,
  children,
  noBtnLabel = "No"
}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogContent sx={{ pt: 2, pb: 0 }}>
        <Stack>
          <Help sx={{ fontSize: "50px", alignSelf: "center" }}></Help>
          <Typography>{children}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ margin: "auto", gap: 1 }}>
        <BasicButton
          variant="contained"
          color="error"
          onClick={handleConfirm}
          loading={isConfirming}
        >
          Yes
        </BasicButton>
        <BasicButton
          variant="contained"
          onClick={handleRedirect}
          loading={isConfirming}
        >
          {noBtnLabel}
        </BasicButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPopup;
