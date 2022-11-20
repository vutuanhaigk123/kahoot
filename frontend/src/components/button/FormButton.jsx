import { Button } from "@mui/material";
import React from "react";

const FormButton = ({ children }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      align="center"
      sx={{ mt: 1, width: "200px" }}
    >
      {children}
    </Button>
  );
};

export default FormButton;
