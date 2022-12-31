import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import usePopup from "./../../../../hooks/usePopup";
import { API, WS_CMD, WS_DATA } from "../../../../commons/constants";
import { Box } from "@mui/system";
import { Edit, Groups, PlayCircleFilledWhite } from "@mui/icons-material";
import PopupForm from "../../../../components/notification/PopupForm";
import BasicButton from "./../../../../components/button/BasicButton";
import CollabPopup from "./CollabPopup";
import { iconHover } from "../../../../commons/globalStyles";
import StartPopup from "./StartPopup";
import ConfirmPopup from "./../../../../components/notification/ConfirmPopup";
import { useSocket } from "../../../../context/socket-context";

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
  const {
    open: openConfirm,
    handleClosePopup: handleCloseConfirmPopup,
    handleOpenPopup: handleOpenConfirmPopup
  } = usePopup();
  const { socketContext, setSocketContext } = useSocket();

  const handleClosePrvPresentation = () => {
    socketContext.emit(
      WS_CMD.CLOSE_PREV_PRESENTATION,
      WS_DATA.ALLOW_CLOSE_PREV_PRESENTATION
    );
    setSocketContext(null);
    handleCloseConfirmPopup();
    handleOpenStartPopup();
  };

  const handleRedirect = () => {
    socketContext.emit(
      WS_CMD.CLOSE_PREV_PRESENTATION,
      WS_DATA.DENIED_CLOSE_PREV_PRESENTATION
    );
    handleCloseConfirmPopup();
  };

  const handleStart = () => {
    // Handle previous running presentation
    if (socketContext) {
      handleOpenConfirmPopup();
    } else {
      handleOpenStartPopup();
    }
  };

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
                  onClick={handleStart}
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
        <ConfirmPopup
          isOpen={openConfirm}
          handleClose={handleRedirect}
          handleConfirm={handleClosePrvPresentation}
        >
          Do you want to close previous presentation
        </ConfirmPopup>
      </div>
    </>
  );
};

export default TitleArea;
