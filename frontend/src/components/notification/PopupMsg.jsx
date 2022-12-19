import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Box, Typography } from "@mui/material";
import { SUBMIT_STATUS } from "../../commons/constants";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PopupMsg = ({
  children,
  status,
  isOpen,
  handleClosePopup,
  navigateTo,
  hasOk = true,
  hideOnSuccess = false,
  sx
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Close the popup
    handleClosePopup();
    // Navigate to a page on success
    if (status === SUBMIT_STATUS.SUCCESS && navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Dialog
      open={hideOnSuccess && status === SUBMIT_STATUS.SUCCESS ? false : isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
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
        {status === SUBMIT_STATUS.ERROR ? (
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
          {hasOk ? (
            <Button variant="contained" onClick={handleClose}>
              Ok
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PopupMsg;
