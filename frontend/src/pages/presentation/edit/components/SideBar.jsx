import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { AddCircle, Clear } from "@mui/icons-material";
import usePopup from "../../../../hooks/usePopup";
import { useSelector } from "react-redux";
import CreateSlideForm from "./CreateSlideForm";
import { API } from "../../../../commons/constants";
import useStatus from "../../../../hooks/useStatus";
import { handlePost } from "../../../../utils/fetch";
import PopupMsg from "../../../../components/notification/PopupMsg";
import { iconButton, iconHover } from "../../../../commons/globalStyles";
import ConfirmPopup from "../../../../components/notification/ConfirmPopup";

const SideBar = ({ refetch, setSlideIndex, slideIndex }) => {
  const { open, handleOpenPopup, handleClosePopup } = usePopup();

  // Get data from redux store
  const data = useSelector((state) => state.presentation);

  // Handle delete slide
  const { status: deleteSlideStatus, handleStatus: handleDeleteSlideStatus } =
    useStatus();
  const {
    open: openSlideDeletePopup,
    handleOpenPopup: handleOpenSlideDeletePopup,
    handleClosePopup: handleCloseSlideDeletePopup
  } = usePopup();
  const {
    open: openConfirm,
    handleOpenPopup: handleOpenConfirm,
    handleClosePopup: handleCloseConfirm
  } = usePopup();
  const [delItem, setDelItem] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDelete = async (slideId) => {
    setIsDeleting(true);
    // Create data to post
    const data_post = {
      presentationId: data._id,
      slideId
    };
    const resp = await handlePost(API.DELETE_SLIDE, data_post);

    handleDeleteSlideStatus(resp);
    handleOpenSlideDeletePopup(); // Open popup
    setSlideIndex(0);
    refetch(); // Refetch data;
    handleCloseConfirm();
    setIsDeleting(false);
  };

  return (
    <Paper
      elevation={10}
      sx={{
        height: "60vh",
        pt: 2,
        pb: 2,
        pl: "15px",
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
                borderColor: index !== slideIndex ? grey[400] : "primary.main",
                position: "relative"
              }}
            >
              <Typography m="auto">{slide.question}</Typography>
              <Clear
                sx={[
                  {
                    fontSize: "15px",
                    position: "absolute",
                    top: 5,
                    right: 5
                  },
                  iconButton,
                  iconHover("error.main")
                ]}
                onClick={() => {
                  setDelItem(slide._id);
                  handleOpenConfirm();
                }}
              />
            </Paper>
          ))
        : null}
      {/* Add slide button */}
      <Paper
        onClick={handleOpenPopup}
        sx={{
          width: "80%",
          height: "20%",
          m: "auto",
          border: 1,
          mb: 2,
          display: "flex",
          cursor: "pointer",
          borderColor: grey[400]
        }}
      >
        <AddCircle sx={{ m: "auto", color: grey[500] }} />
      </Paper>
      <div className="modal-slide">
        {/* Create slide form */}
        <CreateSlideForm
          isOpen={open}
          handleClose={handleClosePopup}
          refetch={refetch}
        ></CreateSlideForm>
        {/* Delete slide popup */}
        <PopupMsg
          status={deleteSlideStatus.type}
          isOpen={openSlideDeletePopup}
          handleClosePopup={handleCloseSlideDeletePopup}
          hideOnSuccess={true}
        >
          {deleteSlideStatus.msg}
        </PopupMsg>
        {/* Confirm popup */}
        <ConfirmPopup
          isOpen={openConfirm}
          handleClose={handleCloseConfirm}
          handleConfirm={() => handleDelete(delItem)}
          isConfirming={isDeleting}
        >
          Are you sure you want to delete
        </ConfirmPopup>
      </div>
    </Paper>
  );
};

export default SideBar;
