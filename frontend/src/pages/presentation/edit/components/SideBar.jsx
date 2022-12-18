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

const iconButton = {
  bgcolor: grey[300],
  borderRadius: "50%",
  color: "black",
  p: "2px"
};

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
  const handleDelete = async (slideId) => {
    // Create data to post
    const data_post = {
      presentationId: data._id,
      slideId
    };
    const resp = await handlePost(API.DELETE_SLIDE, data_post);

    handleDeleteSlideStatus(resp);
    handleOpenSlideDeletePopup(); // Open popup
    setSlideIndex(0);
    refetch(); // Refetch data};
  };

  return (
    <Paper
      elevation={10}
      sx={{
        height: "60vh",
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
                    right: 5,
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "white"
                    }
                  },
                  iconButton
                ]}
                onClick={() => handleDelete(slide._id)}
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
    </Paper>
  );
};

export default SideBar;
