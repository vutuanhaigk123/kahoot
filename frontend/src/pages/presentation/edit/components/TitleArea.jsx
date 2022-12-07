import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import usePopup from "./../../../../hooks/usePopup";
import { API } from "../../../../commons/constants";
import { Box } from "@mui/system";
import { Edit, PlayCircleFilledWhite } from "@mui/icons-material";
import PopupForm from "../../../../components/notification/PopupForm";
import BasicButton from "./../../../../components/button/BasicButton";

const iconButton = {
  bgcolor: "black",
  borderRadius: "50%",
  color: "white",
  p: "5px",
  cursor: "pointer"
};

const TitleArea = ({ refetch }) => {
  // Get data from redux store
  const presentation = useSelector((state) => state.presentation);

  // Handle edit
  const { open, handleClosePopup, handleOpenPopup } = usePopup();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center"
          }}
        >
          <Typography variant="h4">{presentation.title}</Typography>
          <Edit
            sx={[
              {
                "&:hover": {
                  bgcolor: "warning.light",
                  color: "white"
                }
              },
              iconButton
            ]}
            fontSize="small"
            onClick={handleOpenPopup}
          />
        </Box>
        {/* Start button */}
        {presentation._id && presentation.slides.length > 0 ? (
          <BasicButton
            icon={<PlayCircleFilledWhite />}
            onClick={() => console.log("run")}
          >
            Start
          </BasicButton>
        ) : null}
      </Box>
      {/* Edit popup form */}
      <PopupForm
        isOpen={open}
        handleClose={handleClosePopup}
        refetch={refetch}
        api={API.UPDATE_PRESENTATION}
        header="Please enter your new title name"
        label="Title's name"
        fieldName="title"
        otherField={{
          presentationId: presentation._id
        }}
        successMsg="Changes saved"
      ></PopupForm>
    </>
  );
};

export default TitleArea;
