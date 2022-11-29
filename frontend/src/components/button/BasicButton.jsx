import React from "react";
import { Button } from "@mui/material";

const BasicButton = ({
  children,
  variant = "contained",
  color = "primary",
  bgHover = "primary.light",
  icon,
  width = "30%",
  margin = "auto",
  onClick,
  disabled = false,
  type
}) => {
  return (
    <Button
      disabled={disabled}
      disableElevation
      variant={variant}
      color={color}
      startIcon={icon}
      onClick={onClick}
      type={type}
      sx={{
        width: { width },
        margin,
        p: 1,
        "&:hover": {
          bgcolor: `${bgHover}`, // theme.palette.primary.main
          color: "secondary.contrastText"
        }
      }}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
