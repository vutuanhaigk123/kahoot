import React from "react";
import { Button } from "@mui/material";

const BasicButton = ({
  children,
  variant = "contained",
  color = "primary",
  bgHover = "primary.light",
  icon,
  onClick,
  sx,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={icon}
      onClick={onClick}
      sx={[
        {
          "&:hover": {
            bgcolor: `${bgHover}`, // theme.palette.primary.main
            color: "secondary.contrastText"
          }
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
