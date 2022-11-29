import { FormControl } from "@mui/material";
import React from "react";

const FormContent = ({ children }) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 2
      }}
    >
      {children}
    </FormControl>
  );
};

export default FormContent;
