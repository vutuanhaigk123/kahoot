import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Paper,
  Grid,
  Avatar,
  Tooltip,
  Box,
  Typography,
  Button,
  Divider
} from "@mui/material";
import { CheckCircle, Warning } from "@mui/icons-material";
import FormContent from "./FormContent";
import TextBox from "./../input/TextBox";
import { useSelector } from "react-redux";
import { STATUS_ACCOUNT, SUBMIT_STATUS } from "../../commons/constants";
import { API } from "./../../commons/constants";
import { handlePost } from "./../../utils/fetch";
import usePopup from "./../../hooks/usePopup";
import PopupMsg from "./../notification/PopupMsg";
import useToggle from "./../../hooks/useToggle";
import BasicButton from "./../button/BasicButton";

const EditProfileForm = ({ userInfo, refetch }) => {
  const [status, setStatus] = React.useState({});
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const { user } = useSelector((state) => state.auth);
  const { value: isEditable, toggleValue: toggleEditProfile } =
    useToggle(false);

  // Form
  const schema = yup.object({
    addr: yup.string().required("Required"),
    name: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [isHandling, setIsHandling] = React.useState(false);
  const onSubmit = async (data) => {
    setIsHandling(true);
    console.log(
      "🚀 ~ file: EditProfileForm.jsx ~ line 50 ~ onSubmit ~ data",
      data
    );
    const resp = await handlePost(API.PROFILE, data);
    // Handle popup msg
    if (resp) {
      if (resp?.status !== 0) {
        setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.message });
      } else {
        setStatus({
          type: SUBMIT_STATUS.SUCCESS,
          msg: "Changes saved"
        });
        toggleEditProfile(false);
        // Refresh data
        refetch();
      }
      handleOpenPopup();
    }
    setIsHandling(false);
  };

  return (
    <Paper
      elevation={10}
      sx={{
        margin: "auto",
        p: 2,
        width: "100%"
      }}
    >
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
      >
        {status.msg}
      </PopupMsg>
      <Grid container spacing={2} sx={{ pt: 2 }}>
        {/* Profile */}
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
            p: 2
          }}
        >
          <Avatar
            src={userInfo?.picture || user?.data?.picture}
            sx={{ width: "140px", height: "140px" }}
          ></Avatar>
          <Tooltip
            title={
              userInfo.status === STATUS_ACCOUNT.verifying
                ? "Please verify your email"
                : "Verified"
            }
            placement="left-start"
          >
            <Box sx={{ gap: "2px", display: "flex" }}>
              {userInfo.status === STATUS_ACCOUNT.activated ? (
                <CheckCircle color="success"></CheckCircle>
              ) : null}

              {userInfo.status === STATUS_ACCOUNT.verifying ? (
                <Warning color="warning"></Warning>
              ) : null}

              <Typography variant="subtitle1">{userInfo.email}</Typography>
            </Box>
          </Tooltip>
        </Grid>
        <Divider orientation="vertical" variant="middle" flexItem />
        {/* Edit space */}
        <Grid item xs={true}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormContent>
              {/* name */}
              <TextBox
                label="Name"
                helperText={errors.name ? errors.name.message : null}
                name="name"
                defaultValue={userInfo.name}
                size="large"
                control={control}
                disabled={isHandling ? isHandling : !isEditable}
              />
              {/* Address */}
              <TextBox
                label="Address"
                helperText={errors.addr ? errors.addr.message : null}
                name="addr"
                defaultValue={userInfo.addr || ""}
                size="large"
                control={control}
                disabled={isHandling ? isHandling : !isEditable}
              />
              {isEditable ? (
                <BasicButton type="submit" loading={isHandling}>
                  Save
                </BasicButton>
              ) : (
                <Button
                  variant="contained"
                  sx={{ width: "30%" }}
                  onClick={toggleEditProfile}
                >
                  Edit
                </Button>
              )}
            </FormContent>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EditProfileForm;
