import React from "react";
import { Button } from "@mui/material";

const BasicButton = ({
  children,
  variant = "contained",
  color = "primary",
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
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
