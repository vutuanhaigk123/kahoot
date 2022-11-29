import { Button } from "@mui/material";
import React from "react";

const FormButton = ({
  children,
  color = "primary",
  width = "190px",
  align = "center"
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color={color}
      // align="center"
      sx={{ width, height: "34px", alignSelf: align }}
    >
      {children}
    </Button>
  );
};

export default FormButton;
