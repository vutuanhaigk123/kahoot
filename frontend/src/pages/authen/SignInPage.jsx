/* eslint-disable no-undef */
import { Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import TextBox from "../../components/input/TextBox";
import { Link } from "react-router-dom";
import BasicForm from "../../components/form/BasicForm";
import FormHeader from "../../components/form/FormHeader";
import FormContent from "../../components/form/FormContent";
import FormButton from "../../components/button/FormButton";
import PopupMsg from "../../components/notification/PopupMsg";
import { PAGE_ROUTES, SUBMIT_STATUS } from "../../commons/constants";
import { useDispatch } from "react-redux";
import { login } from "../../redux-toolkit/authSlice";
import { API } from "../../commons/constants";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import usePopup from "../../hooks/usePopup";
import { Box } from "@mui/system";
import PopupForm from "../../components/notification/PopupForm";

const SignInPage = () => {
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const {
    open: openForgotPass,
    handleClosePopup: handleCloseForgotPass,
    handleOpenPopup: handleOpenForgotPass
  } = usePopup();

  // Google login
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleCredentialResponse(response) {
    console.log(
      "🚀 ~ file: SignInPage.jsx ~ line 47 ~ handleCredentialResponse ~ response",
      response
    );
    console.log("Encoded JWT ID token: " + response.credential);
    try {
      const result = await axios.post("/api/authen/google", {
        credential: response.credential
      });
      console.log(
        "🚀 ~ file: SignInPage.jsx ~ line 49 ~ handleCredentialResponse ~ result",
        result
      );
      dispatch(login(result.data.info));
      navigate(PAGE_ROUTES.HOME);
    } catch (error) {
      console.log(
        "🚀 ~ file: SignInPage.jsx ~ line 44 ~ handleCredentialResponse ~ error",
        error
      );
    }
  }

  // Form
  const [status, setStatus] = React.useState({});
  const schema = yup.object({
    email: yup.string().email("Email not valid").required("Required"),
    password: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    console.log("🚀 ~ file: SignInPage.jsx ~ line 71 ~ onSubmit ~ data", data);
    try {
      const resp = await axios.post(API.LOGIN, data);
      console.log(
        "🚀 ~ file: SignInPage.jsx ~ line 70 ~ onSubmit ~ resp",
        resp
      );

      // Handle login failed
      if (resp?.data?.status !== 0) {
        setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.data.message });
      } else {
        setStatus({
          type: SUBMIT_STATUS.SUCCESS,
          msg: "Login success"
        });
        // Store data
        dispatch(login(resp.data.data));
      }
      handleOpenPopup();
    } catch (error) {
      console.log(
        "🚀 ~ file: SignInPage.jsx ~ line 90 ~ onSubmit ~ error",
        error
      );
    }
  };

  return (
    <BasicForm>
      {/* Modal */}
      <Box>
        <PopupMsg
          status={status.type}
          isOpen={open}
          handleClosePopup={handleClosePopup}
          navigateTo={PAGE_ROUTES.HOME}
        >
          {status.msg}
        </PopupMsg>
        <PopupForm
          isOpen={openForgotPass}
          handleClose={handleCloseForgotPass}
          // refetch={refetch}
          // api={API.CREATE_GROUP}
          header="Please enter your email ?"
          label="Email"
          buttonLabel="Send"
        />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Sign in"></FormHeader>
        <FormContent>
          <Typography variant="caption">
            Don't have an account?{" "}
            <Typography
              variant="inherit"
              component={Link}
              to={PAGE_ROUTES.REGISTER}
              color="primary"
            >
              Register
            </Typography>
          </Typography>
          {/* email */}
          <TextBox
            required
            label="Email"
            type="email"
            placeholder="Enter your email"
            helperText={errors.email ? errors.email.message : null}
            name="email"
            control={control}
          />
          {/* password */}
          <TextBox
            required
            label="Password"
            type="password"
            placeholder="Enter your password"
            helperText={errors.password ? errors.password.message : null}
            name="password"
            control={control}
          />
          {/* Forgot password */}
          <Typography
            color="primary"
            variant="caption"
            sx={{ alignSelf: "start", cursor: "pointer" }}
            onClick={handleOpenForgotPass}
          >
            Forgot your password?
          </Typography>
          {/* Login button */}
          <FormButton>Login</FormButton>
          {/* Continue as google */}
          <GoogleLogin
            text="continue_with"
            size="medium"
            theme="outlined"
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              handleCredentialResponse(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          ></GoogleLogin>
        </FormContent>
      </form>
    </BasicForm>
  );
};

export default SignInPage;
