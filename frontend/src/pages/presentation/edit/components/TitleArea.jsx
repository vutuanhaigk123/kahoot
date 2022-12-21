import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import usePopup from "./../../../../hooks/usePopup";
import { API } from "../../../../commons/constants";
import { Box } from "@mui/system";
import { Edit, Groups, PlayCircleFilledWhite } from "@mui/icons-material";
import PopupForm from "../../../../components/notification/PopupForm";
import BasicButton from "./../../../../components/button/BasicButton";
import CollabPopup from "./CollabPopup";
import { iconHover } from "../../../../commons/globalStyles";
import StartPopup from "./StartPopup";

const iconButton = {
  bgcolor: "black",
  borderRadius: "50%",
  color: "white",
  p: "5px",
  cursor: "pointer"
};

const TitleArea = ({ refetch, slideIndex }) => {
  // Get data from redux store
  const presentation = useSelector((state) => state.presentation);

  // Handle edit
  const {
    open: openEditTitle,
    handleClosePopup: handleCloseEditTitlePopup,
    handleOpenPopup: handleOpenEditTitlePopup
  } = usePopup();

  // Handle collab
  const {
    open: openCollab,
    handleClosePopup: handleCloseCollabPopup,
    handleOpenPopup: handleOpenCollabPopup
  } = usePopup();

  // Handle start presentation
  const {
    open: openStart,
    handleClosePopup: handleCloseStartPopup,
    handleOpenPopup: handleOpenStartPopup
  } = usePopup();

  return (
    <>
      {/* Main content */}
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
            sx={[iconButton, iconHover("warning.light")]}
            fontSize="small"
            onClick={handleOpenEditTitlePopup}
          />
        </Box>
        {/* Button group */}
        {presentation.isOwner ? (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Collab view button */}
              <BasicButton
                variant="contained"
                icon={<Groups />}
                onClick={handleOpenCollabPopup}
              >
                Collaborator
              </BasicButton>
              {/* Start button */}
              {presentation._id && presentation.slides.length > 0 ? (
                <BasicButton
                  color="secondary"
                  variant="contained"
                  icon={<PlayCircleFilledWhite />}
                  onClick={() => handleOpenStartPopup()}
                >
                  Start
                </BasicButton>
              ) : null}
            </Box>
          </>
        ) : null}
      </Box>
      <div className="modal-area">
        {/* Edit title popup form */}
        <PopupForm
          isOpen={openEditTitle}
          handleClose={handleCloseEditTitlePopup}
          refetch={refetch}
          api={API.UPDATE_PRESENTATION}
          header="Please enter your new title name"
          label="Title's name"
          fieldName="title"
          otherField={{
            presentationId: presentation._id
          }}
          buttonLabel="Rename"
          successMsg="Changes saved"
        />
        <CollabPopup
          isOpen={openCollab}
          handleClose={handleCloseCollabPopup}
          refetch={refetch}
        />
        <StartPopup
          isOpen={openStart}
          handleClose={handleCloseStartPopup}
          slideIndex={slideIndex}
        />
      </div>
    </>
  );
};

export default TitleArea;
