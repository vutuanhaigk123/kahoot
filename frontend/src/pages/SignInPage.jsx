/* eslint-disable no-undef */
import { Box, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import TextBox from "../components/input/TextBox";
import { Link } from "react-router-dom";
import BasicForm from "./../components/form/BasicForm";
import FormHeader from "./../components/form/FormHeader";
import FormContent from "./../components/form/FormContent";
import FormButton from "./../components/button/FormButton";
import Popup from "../components/notification/Popup";
import { googleScript, PAGE_ROUTES, SUBMIT_STATUS } from "../commons/constants";
import { useDispatch } from "react-redux";
import { login } from "../redux-toolkit/authSlice";
import useScript from "./../hooks/useScript";
import { API } from "./../commons/constants";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  // Google login
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useScript(googleScript); //Load google script for button
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.google) {
      return;
    }

    console.log(process.env.REACT_APP_GG_APP_ID);
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GG_APP_ID,
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "filled_blue", size: "medium", text: "continue_with" } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  });

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const result = await axios.post("/api/authen/google", {
      credential: response.credential
    });
    console.log(
      "🚀 ~ file: SignInPage.jsx ~ line 49 ~ handleCredentialResponse ~ result",
      result
    );
    dispatch(login(result.data));
    navigate(PAGE_ROUTES.HOME);
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
        dispatch(login(resp.data));
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: SignInPage.jsx ~ line 90 ~ onSubmit ~ error",
        error
      );
    }
  };

  return (
    <BasicForm>
      {Object.keys(status).length > 0 ? (
        <Popup type={status.type}>{status.msg}</Popup>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Sign in"></FormHeader>
        <FormContent>
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
          <Typography variant="caption" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link to={PAGE_ROUTES.REGISTER} style={{ color: "#005ef6" }}>
              Register
            </Link>
          </Typography>
          {/* Login button */}
          <FormButton>Login</FormButton>
          {/* Continue as google */}
          <Box align="center" id="buttonDiv" mt={2} width="100%"></Box>
        </FormContent>
      </form>
    </BasicForm>
  );
};

export default SignInPage;
