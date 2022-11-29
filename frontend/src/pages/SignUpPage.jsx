import React from "react";
import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import TextBox from "../components/input/TextBox";
import { Link } from "react-router-dom";
import BasicForm from "../components/form/BasicForm";
import FormHeader from "./../components/form/FormHeader";
import FormContent from "./../components/form/FormContent";
import FormButton from "./../components/button/FormButton";
import { PAGE_ROUTES, SUBMIT_STATUS } from "../commons/constants";
import PopupMsg from "../components/notification/PopupMsg";
import { API } from "./../commons/constants";
import usePopup from "./../hooks/usePopup";

function SignupPage() {
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  // Form
  const [status, setStatus] = React.useState({});
  console.log(
    "🚀 ~ file: SignUpPage.jsx ~ line 22 ~ SignupPage ~ status",
    status
  );
  const schema = yup.object({
    name: yup.string().required("Required"),
    email: yup.string().email("Email not valid").required("Required"),
    password: yup
      .string()
      .required("Required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password too weak"
      ),
    addr: yup.string().required("Required"),
    Cpwd: yup
      .string()
      .required("Required")
      .oneOf([yup.ref("password"), null], "Passwords not match")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    console.log("🚀 ~ file: SignUpPage.jsx ~ line 48 ~ onSubmit ~ data", data);
    try {
      const resp = await axios.post(API.REGISTER, data);
      console.log(
        "🚀 ~ file: SignUpPage.jsx ~ line 51 ~ onSubmit ~ resp",
        resp
      );

      // Handle register failed
      if (resp?.data?.status !== 0) {
        setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.data.message });
      } else {
        setStatus({
          type: SUBMIT_STATUS.SUCCESS,
          msg: "Register success. Please check your email to confirm"
        });
        // Store data
        // dispatch(login(resp.data));
      }
      handleOpenPopup();
    } catch (error) {
      console.log(
        "🚀 ~ file: SignUpPage.jsx ~ line 68 ~ onSubmit ~ error",
        error
      );
    }
  };

  return (
    <BasicForm maxWidth="65%">
      <PopupMsg
        status={status.type}
        isOpen={open}
        handleClosePopup={handleClosePopup}
        navigateTo={PAGE_ROUTES.LOGIN}
      >
        {status.msg}
      </PopupMsg>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader
          title="Sign up"
          caption="Please fill this form to create an account!"
        ></FormHeader>

        <FormContent>
          {/* Full Name */}
          <TextBox
            required
            label="Full name"
            placeholder="Enter your full name"
            helperText={errors.name ? errors.name.message : null}
            name="name"
            control={control}
          />

          {/* Email */}
          <TextBox
            required
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            control={control}
            helperText={errors.email ? errors.email.message : null}
          />

          {/* Address */}
          <TextBox
            required
            label="Address"
            placeholder="Enter your address"
            name="addr"
            control={control}
            helperText={errors.addr ? errors.addr.message : null}
          />

          {/* Password */}
          <TextBox
            required
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            control={control}
            helperText={errors.password ? errors.password.message : null}
          />
          <TextBox
            required
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            name="Cpwd"
            control={control}
            helperText={errors.Cpwd ? errors.Cpwd.message : null}
          />

          {/* Sign up button */}
          <FormButton>Register</FormButton>
          <Typography variant="caption" align="center">
            Already have an account?{" "}
            <Typography
              component={Link}
              variant="inherit"
              to={PAGE_ROUTES.LOGIN}
              color="primary"
            >
              Login
            </Typography>
          </Typography>
        </FormContent>
      </form>
    </BasicForm>
  );
}

export default SignupPage;
