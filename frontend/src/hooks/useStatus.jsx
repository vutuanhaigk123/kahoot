import React from "react";
import { SUBMIT_STATUS } from "../commons/constants";

const useStatus = () => {
  const [status, setStatus] = React.useState({});

  const handleStatus = (resp, successMsg = "") => {
    if (resp.status !== 0) {
      setStatus({
        type: SUBMIT_STATUS.ERROR,
        msg: resp.message,
        status: resp.status
      });
    } else {
      setStatus({
        type: SUBMIT_STATUS.SUCCESS,
        msg: successMsg,
        status: resp.status
      });
    }
  };

  return { status, handleStatus };
};

export default useStatus;
