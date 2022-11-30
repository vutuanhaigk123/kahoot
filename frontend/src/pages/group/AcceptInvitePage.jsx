import React from "react";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import { Button, Paper, Typography } from "@mui/material";
import { Cancel, Pending } from "@mui/icons-material";
import BasicButton from "../../components/button/BasicButton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API, PAGE_ROUTES, SUBMIT_STATUS } from "../../commons/constants";
import { handleGet } from "../../utils/fetch";

const AcceptInvitePage = () => {
  // Check login
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const [status, setStatus] = React.useState({});

  const handleAccept = async () => {
    const token = searchParam.get("token");
    const groupId = searchParam.get("id");
    const resp = await handleGet(`${API.JOIN}?id=${groupId}&token=${token}`);
    console.log(
      "🚀 ~ file: AcceptInvitePage.jsx ~ line 25 ~ handleAccept ~ resp",
      resp
    );
    if (resp.status !== 0) {
      setStatus({ type: SUBMIT_STATUS.ERROR, msg: resp.message });
      console.log("error");
    } else {
      navigate(`${PAGE_ROUTES.GROUP}/${groupId}`);
    }
  };

  return (
    <BackgroundContainer>
      <Paper
        sx={{
          m: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          gap: 2
        }}
      >
        {status?.type === SUBMIT_STATUS.ERROR ? (
          <FailMsg msg={status.msg}></FailMsg>
        ) : (
          <NormalMsg handleAccept={() => handleAccept()}></NormalMsg>
        )}
      </Paper>
    </BackgroundContainer>
  );
};

const NormalMsg = ({ handleAccept }) => {
  return (
    <>
      <Typography variant="h4">Your invite is waiting</Typography>
      <Pending sx={{ fontSize: "120px", color: "primary.main" }} />
      <BasicButton onClick={handleAccept} color="success" width="60%">
        Accept invitation
      </BasicButton>
    </>
  );
};

const FailMsg = ({ msg }) => {
  return (
    <>
      <Typography variant="h4">{msg}</Typography>
      <Cancel sx={{ fontSize: "120px", color: "error.main" }}></Cancel>
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

export default AcceptInvitePage;
