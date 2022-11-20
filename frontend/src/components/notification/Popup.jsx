import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Box, Typography } from "@mui/material";
import { SUBMIT_STATUS } from "../../commons/constants";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Popup = ({ children, type }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 50px 10px 50px"
        }}
      >
        {type === SUBMIT_STATUS.ERROR ? (
          <CancelRoundedIcon
            color="error"
            sx={{ fontSize: "60px" }}
          ></CancelRoundedIcon>
        ) : (
          <CheckCircleRoundedIcon
            color="success"
            sx={{ fontSize: "60px" }}
          ></CheckCircleRoundedIcon>
        )}

        <Typography variant="h6">{children}</Typography>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default Popup;
