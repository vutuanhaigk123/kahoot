import { TextField } from "@mui/material";
import React from "react";
import { useController } from "react-hook-form";
import { Box } from "@mui/material";

const TextBox = ({ name = "", control, ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: ""
  });
  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        sx={{
          marginBottom: "15px",
          width: "100%",
          // height: "65px",
          "& .MuiInputLabel-asterisk, & .MuiFormHelperText-root": {
            color: "red"
          }
        }}
        id={name}
        {...props}
        {...field}
      />
    </>
  );
};

export default TextBox;
