import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

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
    <LoadingButton
      variant={variant}
      color={color}
      startIcon={icon}
      onClick={onClick}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};

export default BasicButton;
