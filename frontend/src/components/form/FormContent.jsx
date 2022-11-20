import { FormControl } from "@mui/material";
import React from "react";

const FormContent = ({ children }) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}
    >
      {children}
    </FormControl>
  );
};

export default FormContent;
