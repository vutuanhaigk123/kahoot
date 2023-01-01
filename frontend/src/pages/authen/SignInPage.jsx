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
import PopupMsg from "../../components/notification/PopupMsg";
import { PAGE_ROUTES } from "../../commons/constants";
import { useDispatch } from "react-redux";
import { login } from "../../redux-toolkit/authSlice";
import { API } from "../../commons/constants";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import usePopup from "../../hooks/usePopup";
import PopupForm from "../../components/notification/PopupForm";
import useStatus from "../../hooks/useStatus";
import { handlePost } from "../../utils/fetch";
import BasicButton from "../../components/button/BasicButton";

const SignInPage = () => {
  // Google login
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Loading login
  const [isLogining, setIsLogining] = React.useState(false);
  async function handleCredentialResponse(response) {
    setIsLogining(true);
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
    setIsLogining(false);
  }

  // Form
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

  // Handle login
  const { status: loginStatus, handleStatus: handleLoginStatus } = useStatus();
  const {
    open: openLoginPopup,
    handleClosePopup: handleCloseLoginPopup,
    handleOpenPopup: handleOpenLoginPopup
  } = usePopup();
  const onSubmit = async (data) => {
    setIsLogining(true);
    const resp = await handlePost(API.LOGIN, data);
    console.log("🚀 ~ file: SignInPage.jsx:84 ~ onSubmit ~ resp", resp);

    handleLoginStatus(resp);

    // Store data
    if (resp.status === 0) {
      dispatch(login(resp.data));
    }
    handleOpenLoginPopup();
    setIsLogining(false);
  };

  // Handle forgot pass
  const {
    open: openForgotPass,
    handleClosePopup: handleCloseForgotPass,
    handleOpenPopup: handleOpenForgotPass
  } = usePopup();

  return (
    <BasicForm>
      {/* Modal */}
      <div className="login-modal">
        {/* Login msg */}
        <PopupMsg
          status={loginStatus.type}
          isOpen={openLoginPopup}
          handleClosePopup={handleCloseLoginPopup}
          navigateTo={PAGE_ROUTES.HOME}
          hideOnSuccess={true}
        >
          {loginStatus.msg}
        </PopupMsg>
        {/* Forgot password modal */}
        <PopupForm
          isOpen={openForgotPass}
          handleClose={handleCloseForgotPass}
          api={API.FORGOT_PASSWORD}
          header="Please enter your email ?"
          label="Email"
          fieldName="email"
          buttonLabel="Send"
          successMsg="Please check your email if you have already register with this email"
        />
      </div>
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
          <BasicButton
            type="submit"
            sx={{ width: 190, height: 34 }}
            loading={isLogining}
          >
            Login
          </BasicButton>
          {/* Continue as google */}
          {isLogining ? null : (
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
          )}
        </FormContent>
      </form>
    </BasicForm>
  );
};

export default SignInPage;
