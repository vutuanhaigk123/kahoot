import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import EditType from "./edit-type/EditType";

const EditArea = ({ slideIndex, refetch }) => {
  const presentation = useSelector((state) => state.presentation);

  return (
    <Paper
      elevation={10}
      sx={{
        maxHeight: "60vh",
        p: 2,
        overflowY: "scroll",
        textAlign: "center"
      }}
    >
      {presentation._id && presentation.slides.length > 0 ? (
        <EditType slideIndex={slideIndex} refetch={refetch} />
      ) : (
        <Typography>Please add slide to edit</Typography>
      )}
    </Paper>
  );
};

export default EditArea;
