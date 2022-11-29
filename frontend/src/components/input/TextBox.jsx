import { TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

const TextBox = ({
  name = "",
  variant = "outlined",
  defaultValue = "",
  size = "small",
  control,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue
  });
  return (
    <TextField
      variant={variant}
      size={size}
      sx={{
        // marginBottom: "15px",
        width: "100%",
        // maxHeight: "58px",
        "& .MuiInputLabel-asterisk, & .MuiFormHelperText-root": {
          color: "red"
        }
      }}
      id={name}
      {...props}
      {...field}
    />
  );
};

export default TextBox;
