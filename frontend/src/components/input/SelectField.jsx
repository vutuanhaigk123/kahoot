import { TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";

const SelectField = ({
  name = "",
  variant = "outlined",
  defaultValue = "",
  size = "small",
  control,
  children,
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
        width: "100%",
        "& .MuiInputLabel-asterisk, & .MuiFormHelperText-root": {
          color: "red"
        }
      }}
      id={name}
      {...props}
      {...field}
    >
      {children}
    </TextField>
  );
};

export default SelectField;
