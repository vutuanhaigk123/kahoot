import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";
import { API, PAGE_ROUTES } from "../../commons/constants";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import { handlePost } from "./../../utils/fetch";
import { Cancel, LinkOff, LockReset, Mail } from "@mui/icons-material";
import useStatus from "../../hooks/useStatus";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormContent from "../../components/form/FormContent";
import TextBox from "../../components/input/TextBox";
import BasicButton from "../../components/button/BasicButton";
import usePopup from "../../hooks/usePopup";
import PopupMsg from "../../components/notification/PopupMsg";

const ResetPassPage = () => {
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token");

  const [isValidating, setIsValidating] = React.useState(false);
  const { status, handleStatus } = useStatus();
  const validateToken = async () => {
    setIsValidating(true);
    const resp = await handlePost(API.VALIDATE_RESET_PASSWORD, { token });
    handleStatus(resp);
    setIsValidating(false);
  };

  React.useEffect(() => {
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BackgroundContainer>
      <Paper
        evaluation={20}
        sx={{
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: "20px 40px",
          gap: 2,
          width: "20%"
        }}
      >
        {isValidating ? (
          <LoadingMsg></LoadingMsg>
        ) : status.status === 0 ? (
          <ChangePassForm token={token}></ChangePassForm>
        ) : (
          <FailMsg msg={status.msg} status={status.status}></FailMsg>
        )}
      </Paper>
    </BackgroundContainer>
  );
};

const LoadingMsg = () => {
  return (
    <>
      <Mail sx={{ fontSize: "120px" }} color="primary"></Mail>
      <Box display="flex" gap={2}>
        <CircularProgress></CircularProgress>
        <Typography variant="h5">Verifying access...</Typography>
      </Box>
    </>
  );
};

const ChangePassForm = ({ token }) => {
  const { status, handleStatus } = useStatus();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  // Form
  const schema = yup.object({
    pwd: yup
      .string()
      .required("Required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password too weak"
      ),
    Cpwd: yup
      .string()
      .required("Required")
      .oneOf([yup.ref("pwd")], "Passwords not match")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const onSubmit = async (data) => {
    setIsProcessing(true);
    const submitData = {
      token,
      pwd: data.pwd
    };
    const resp = await handlePost(API.RESET_PASSWORD, submitData);
    console.log("🚀 ~ file: ResetPassPage.jsx:118 ~ onSubmit ~ resp", resp);

    handleStatus(resp, "Change success");

    // Open popup message
    handleOpenPopup();
    setIsProcessing(false);
  };
  return (
    <>
      <LockReset sx={{ fontSize: "140px" }} />
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormContent>
          {/* New password */}
          <TextBox
            label="New password"
            helperText={errors.pwd ? errors.pwd.message : null}
            name="pwd"
            type="password"
            size="large"
            control={control}
          />
          {/* Confirm new password */}
          <TextBox
            label="Re-enter new password"
            helperText={errors.Cpwd ? errors.Cpwd.message : null}
            name="Cpwd"
            type="password"
            size="large"
            control={control}
          />
          <BasicButton fullWidth type="submit" loading={isProcessing}>
            Change
          </BasicButton>
        </FormContent>
      </form>
      <div className="modal-change-pass">
        <PopupMsg
          status={status.type}
          isOpen={open}
          handleClosePopup={handleClosePopup}
          navigateTo={PAGE_ROUTES.LOGIN}
        >
          {status.msg}
        </PopupMsg>
      </div>
    </>
  );
};

const FailMsg = ({ msg, status }) => {
  return (
    <>
      {status === 400 ? (
        <Cancel color="error" sx={{ fontSize: "120px" }}></Cancel>
      ) : (
        <LinkOff sx={{ fontSize: "120px" }}></LinkOff>
      )}

      <Typography variant="h5">
        {status === 400 ? "Invalid link" : msg}
      </Typography>
      <Button
        component={Link}
        to={PAGE_ROUTES.HOME}
        variant="contained"
        color="primary"
      >
        Return home
      </Button>
    </>
  );
};

export default ResetPassPage;
