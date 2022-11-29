import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Paper } from "@mui/material";
import FormContent from "./FormContent";
import TextBox from "./../input/TextBox";
import FormButton from "../button/FormButton";
import { SUBMIT_STATUS } from "../../commons/constants";
import { API } from "./../../commons/constants";
import { handlePost } from "./../../utils/fetch";
import usePopup from "./../../hooks/usePopup";
import PopupMsg from "./../notification/PopupMsg";
import { LockReset } from "@mui/icons-material";

const ChangePassForm = () => {
  const [status, setStatus] = React.useState({});
  const { open, handleClosePopup, handleOpenPopup } = usePopup();

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
      .oneOf([yup.ref("pwd")], "Passwords not match"),
    curPwd: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    console.log(
      "🚀 ~ file: EditProfileForm.jsx ~ line 50 ~ onSubmit ~ data",
      data
    );
    const resp = await handlePost(API.CHANGE_PASSWORD, data);
    // Handle popup msg
    if (resp) {
      if (resp?.status !== 0) {
        setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.message });
      } else {
        setStatus({
          type: SUBMIT_STATUS.SUCCESS,
          msg: "Changes saved"
        });
      }
      handleOpenPopup();
    }
  };

  return (
    <Paper
      elevation={10}
      sx={{
        margin: "auto",
        p: 2,
        width: "60%",
        textAlign: "center"
      }}
    >
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
      >
        {status.msg}
      </PopupMsg>
      <LockReset sx={{ fontSize: "140px" }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContent>
          {/* Current password */}
          <TextBox
            label="Current password"
            helperText={errors.curPwd ? errors.curPwd.message : null}
            name="curPwd"
            type="password"
            size="large"
            control={control}
          />
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
          <FormButton align="center" width="30%">
            Save
          </FormButton>
        </FormContent>
      </form>
    </Paper>
  );
};

export default ChangePassForm;
