import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import BasicButton from "../../../../components/button/BasicButton";
import { AddCircle } from "@mui/icons-material";
import usePopup from "../../../../hooks/usePopup";
import { useSelector } from "react-redux";
import CreateSlideForm from "./CreateSlideForm";

const SideBar = ({ refetch, setSlideIndex, slideIndex }) => {
  const { open, handleOpenPopup, handleClosePopup } = usePopup();

  // Get data from redux store
  const data = useSelector((state) => state.presentation);

  return (
    <Paper
      elevation={10}
      sx={{
        height: "100%",
        width: "100%",
        p: 2,
        overflowY: "scroll",
        textAlign: "center"
      }}
    >
      {/* Item list */}
      {data._id
        ? data.slides.map((slide, index) => (
            <Paper
              key={slide._id}
              onClick={() => setSlideIndex(index)}
              sx={{
                width: "80%",
                height: "20%",
                m: "auto",
                border: index !== slideIndex ? 1 : 3,
                mb: 2,
                display: "flex",
                cursor: "pointer",
                borderColor: index !== slideIndex ? grey[400] : "primary.main"
              }}
            >
              <Typography m="auto">{slide.question}</Typography>
            </Paper>
          ))
        : null}

      {/* Add slide button */}
      <BasicButton onClick={handleOpenPopup} icon={<AddCircle />} fullWidth>
        Add slide
      </BasicButton>
      <CreateSlideForm
        isOpen={open}
        handleClose={handleClosePopup}
        refetch={refetch}
      ></CreateSlideForm>
    </Paper>
  );
};

export default SideBar;
