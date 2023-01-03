import React from "react";
import BasicButton from "./../button/BasicButton";
import {
  Button,
  Dialog,
  Typography,
  DialogActions,
  TextField,
  Box,
  DialogContent
} from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { API, SUBMIT_STATUS } from "../../commons/constants";
import { Close, RemoveCircle } from "@mui/icons-material";
import { handlePost } from "./../../utils/fetch";
import usePopup from "./../../hooks/usePopup";
import PopupMsg from "./PopupMsg";
import Transition from "./../../pages/presentation/modal/components/Transition";
import { iconButton, iconHover } from "../../commons/globalStyles";

const formType = { inviteLink: 1, inviteEmail: 2 };

const PopupFormInvite = ({ isOpen, handleClose, inviteLink, groupId }) => {
  const [type, setType] = React.useState(formType.inviteLink);
  const handleCLosePopUp = () => {
    handleClose();
    setType(formType.inviteLink);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={handleCLosePopUp}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <Close
        sx={[
          { position: "absolute", top: 5, right: 5 },
          iconButton,
          iconHover("error.main")
        ]}
        onClick={handleCLosePopUp}
      />
      {/* Close form when recieved resp */}
      {type === formType.inviteLink ? (
        <InviteLinkForm
          inviteLink={inviteLink}
          handleClose={handleCLosePopUp}
          setType={() => setType}
        ></InviteLinkForm>
      ) : (
        <InviteEmailForm
          handleClose={handleCLosePopUp}
          groupId={groupId}
        ></InviteEmailForm>
      )}
    </Dialog>
  );
};

const InviteLinkForm = ({ inviteLink, setType }) => {
  return (
    <DialogContent sx={{ textAlign: "center", p: 6, pb: 3 }}>
      <Box sx={{ display: "flex" }}>
        <TextField
          label="Invitation link"
          sx={{
            "& .MuiInputBase-input": {
              overflow: "hidden",
              textOverflow: "ellipsis"
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bolder"
            }
          }}
          inputProps={{ readOnly: true }}
          value={inviteLink}
          fullWidth
        ></TextField>
        <CopyToClipboard text={inviteLink}>
          <Button
            variant="contained"
            sx={{
              "&:hover": {
                bgcolor: "primary.light", // theme.palette.primary.main
                color: "secondary.contrastText"
              }
            }}
          >
            Copy
          </Button>
        </CopyToClipboard>
      </Box>
      <Button sx={{ p: 0 }} onClick={setType(formType.inviteEmail)}>
        Invite with email
      </Button>
    </DialogContent>
  );
};

const InviteEmailForm = ({ handleClose, groupId }) => {
  const [status, setStatus] = React.useState({});
  const [isDisable, setIsDisable] = React.useState(true);
  const [emails, setEmails] = React.useState([]);
  const {
    open: openMsgPopup,
    handleClosePopup: handleCloseMsgPopup,
    handleOpenPopup: handleOpenMsgPopup
  } = usePopup();

  const handleSendMail = async () => {
    const submitData = {
      emailList: JSON.stringify(emails),
      groupId: groupId
    };
    console.log(
      "🚀 ~ file: PopUpFormInvite.jsx:120 ~ handleSendMail ~ submitData",
      submitData
    );
    const resp = await handlePost(API.GROUP_INVITE_EMAIL, submitData);

    // Handle login failed
    if (resp?.status !== 0) {
      setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.message });
    } else {
      setStatus({
        type: SUBMIT_STATUS.SUCCESS,
        msg: "Invite success"
      });
    }
    // handleClose();
    handleOpenMsgPopup();
  };

  const handleRemoveEmail = (value) => {
    const newEmails = emails.filter((item) => item !== value);
    setEmails(newEmails);
  };

  // Form
  const schema = yup.object({
    email: yup
      .string()
      .email("Email not valid")
      .required("Required")
      .test(
        "exist",
        "Email have already been added",
        (email) => !emails.includes(email)
      )
  });
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => {
    console.log(
      "🚀 ~ file: PopUpFormInvite.jsx ~ line 108 ~ onSubmit ~ data",
      data
    );
    setEmails((oldEmails) => [...oldEmails, data.email]);
    reset();
  };

  return (
    <DialogContent sx={{ textAlign: "center", mt: 4 }}>
      <PopupMsg
        status={status.type}
        isOpen={openMsgPopup}
        handleClosePopup={handleCloseMsgPopup}
      >
        {status.msg}
      </PopupMsg>
      {/* Added email box */}
      <Box
        sx={{
          border: 1,
          borderColor: "grey.400",
          maxHeight: "40vh",
          mb: 2,
          flexWrap: "wrap",
          overflowY: "scroll",
          p: 2,
          display: "flex",
          gap: 2
        }}
      >
        {emails.length > 0 ? (
          emails.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: "160px",
                height: "25px",
                display: "flex",
                gap: 1,
                border: 1,
                borderRadius: 1,
                p: 1,
                margin: "auto",
                cursor: "pointer"
              }}
            >
              <RemoveCircle />
              <Typography
                variant="outlined"
                onClick={() => handleRemoveEmail(item)}
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {item}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="caption" sx={{ margin: "auto" }}>
            Please add emails
          </Typography>
        )}
      </Box>
      {/* Email added textfield */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
        <TextField
          {...register("email")}
          label="Enter the emails here"
          type="email"
          helperText={errors.email ? errors.email.message : ""}
          onChange={(e) => setIsDisable(!e.target.value)}
          size="small"
          sx={{
            width: "100%",
            "& .MuiInputLabel-asterisk, & .MuiFormHelperText-root": {
              color: "red"
            }
          }}
        ></TextField>
        <Button
          variant="contained"
          type="submit"
          disabled={isDisable}
          sx={{
            "&:hover": {
              bgcolor: "primary.light", // theme.palette.primary.main
              color: "secondary.contrastText"
            },
            height: "40px"
          }}
        >
          Add
        </Button>
      </form>
      {/* Action */}
      <DialogActions
        sx={{ p: 0, textAlign: "center", justifyContent: "center", mt: 2 }}
      >
        <BasicButton
          disabled={emails.length === 0}
          variant="contained"
          onClick={handleSendMail}
        >
          Invite
        </BasicButton>
      </DialogActions>
    </DialogContent>
  );
};

export default PopupFormInvite;
