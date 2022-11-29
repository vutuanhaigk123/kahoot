import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import BackgroundContainer from "../components/misc/BackgroundContainer";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API, PAGE_ROUTES } from "../commons/constants";
import MailIcon from "@mui/icons-material/Mail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useQuery } from "react-query";
import LinkOffIcon from "@mui/icons-material/LinkOff";

const handleVerifyEmail = async (token) => {
  try {
    const resp = await axios.get(`${API.VERIFY_EMAIL}?token=${token}`);
    console.log(
      "🚀 ~ file: VerifyEmail.jsx ~ line 17 ~ VerifyEmail ~ resp",
      resp
    );
    return resp.data;
  } catch (error) {
    console.log(
      "🚀 ~ file: VerifyEmail.jsx ~ line 18 ~ VerifyEmail ~ error",
      error
    );
  }
};

const VerifyEmailPage = () => {
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token");
  const { isLoading, error, data } = useQuery("respEmail", () =>
    handleVerifyEmail(token)
  );
  console.log(
    "🚀 ~ file: VerifyEmail.jsx ~ line 38 ~ VerifyEmail ~ data",
    data
  );

  if (error) return "An error has occurred: " + error.message;

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
          gap: 2
        }}
      >
        {isLoading ? <LoadingMsg></LoadingMsg> : null}
        {data && (data.status === 422 || data.status === 410) ? (
          <FailMsg msg={data.message} status={data.status}></FailMsg>
        ) : (
          <SuccessMsg></SuccessMsg>
        )}
      </Paper>
    </BackgroundContainer>
  );
};

const LoadingMsg = () => {
  return (
    <>
      <MailIcon sx={{ fontSize: "120px" }} color="primary"></MailIcon>
      <Box display="flex" gap={2}>
        <CircularProgress></CircularProgress>
        <Typography variant="h5">Verifying your email...</Typography>
      </Box>
    </>
  );
};

const SuccessMsg = () => {
  return (
    <>
      <CheckCircleIcon
        sx={{ fontSize: "120px", color: "green" }}
      ></CheckCircleIcon>
      <Typography variant="h5">Successfully confirm</Typography>
      <Button variant="contained" color="primary">
        Return home
      </Button>
    </>
  );
};

const FailMsg = ({ msg, status }) => {
  return (
    <>
      {status === 410 ? (
        <CancelIcon sx={{ fontSize: "120px", color: "red" }}></CancelIcon>
      ) : (
        <LinkOffIcon sx={{ fontSize: "120px" }}></LinkOffIcon>
      )}

      <Typography variant="h5">{msg}</Typography>
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

export default VerifyEmailPage;
