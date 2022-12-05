import { Paper, Typography, TextField } from "@mui/material";
import React from "react";
import TextBox from "../../../../components/input/TextBox";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicButton from "../../../../components/button/BasicButton";
import { AddCircle, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import { Cancel } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { grey } from "@mui/material/colors";

const textBoxArr = [
  {
    id: uuidv4(),
    question: "Options 1"
  }
];

const EditArea = () => {
  // Form
  const [status, setStatus] = React.useState({});
  const schema = yup.object({
    question: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => {
    console.log("🚀 ~ file: EditArea.jsx:23 ~ onSubmit ~ data", data);
  };

  // Options
  const [options, setOptions] = React.useState(textBoxArr);
  console.log("🚀 ~ file: EditArea.jsx:37 ~ EditArea ~ options", options);

  const handleAdd = () => {
    const newArr = [...options, ""];
    setOptions(newArr);
  };

  const handleChange = (onChangeValue, i) => {
    const inputdata = [...options];
    inputdata[i] = onChangeValue.target.value;
    setOptions(inputdata);
  };

  const handleDelete = (index) => {
    const delOption = [...options];
    delOption.splice(index, 1);
    setOptions(delOption);
  };

  return (
    <Paper
      elevation={10}
      sx={{
        maxHeight: "400px",
        width: "100%",
        p: 2,
        overflowY: "scroll"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Save button */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Edit
            sx={{
              // border: 1,
              bgcolor: grey[300],
              borderRadius: "50%",
              p: "5px"
            }}
          />
          <BasicButton type="submit">Save</BasicButton>
        </Box>
        {/* Question */}
        <Typography variant="h6" fontWeight="bold">
          Your question
        </Typography>
        <TextBox
          placeholder="Enter your question"
          helperText={errors.question ? errors.question.message : " "}
          name="question"
          control={control}
        ></TextBox>

        {/* Options */}
        <Typography variant="h6" fontWeight="bold">
          Options
        </Typography>
        {options.map((item, index) => {
          return (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                m: "10px 0 10px 0",
                alignItems: "center",
                gap: 1
              }}
            >
              <TextField
                // onChange={(e) => handleChange(e, index)}
                size="small"
                value={item.title || `Options ${index}`}
                placeholder={`Options ${index}`}
                // id={index}
              />
              <Cancel onClick={() => handleDelete(index)} />
            </Box>
          );
        })}
        <BasicButton onClick={handleAdd} icon={<AddCircle />} fullWidth>
          Add option
        </BasicButton>
      </form>
    </Paper>
  );
};

export default EditArea;
