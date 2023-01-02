import { AddCircle, Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  List,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API, PAGE_ROUTES } from "../../../../commons/constants";
import BasicButton from "../../../../components/button/BasicButton";
import ConfirmPopup from "../../../../components/notification/ConfirmPopup";
import PopupForm from "../../../../components/notification/PopupForm";
import PopupMsg from "../../../../components/notification/PopupMsg";
import usePopup from "../../../../hooks/usePopup";
import useStatus from "../../../../hooks/useStatus";
import { handleGet, handlePost } from "../../../../utils/fetch";
import Empty from "../../../group/components/Empty";

const OwnedPresentation = () => {
  const navigate = useNavigate();
  const { open, handleOpenPopup, handleClosePopup } = usePopup();
  const {
    open: openMsgPopup,
    handleOpenPopup: handleOpenMsgPopup,
    handleClosePopup: handleCloseMsgPopup
  } = usePopup();

  const { isLoading, error, data, refetch } = useQuery("presentationList", () =>
    handleGet(API.PRESENTATION_LIST)
  );

  const { user } = useSelector((state) => state?.auth);

  const { status, handleStatus } = useStatus();
  const {
    open: openConfirm,
    handleOpenPopup: handleOpenConfirm,
    handleClosePopup: handleCloseConfirm
  } = usePopup();
  const [delItem, setDelItem] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDelete = async (presentationId) => {
    setIsDeleting(true);
    const resp = await handlePost(API.DELETE_PRESENTAION, { presentationId });
    handleStatus(resp, ""); // update popup msg status
    handleOpenMsgPopup(); // Open popup
    refetch(); // Refetch data
    handleCloseConfirm();
    setIsDeleting(false);
  };

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Paper
        sx={{
          p: "40px 40px 20px 40px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          maxWidth: "100%",
          margin: "auto",
          gap: 2,
          maxHeight: "60vh"
        }}
        elevation={5}
      >
        {/* Slide item */}
        {data?.info?.length > 0 ? (
          <List sx={{ maxHeight: "100%", overflowY: "scroll" }}>
            {data.info.map((item) => (
              <Card
                key={item._id}
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  boxShadow: 4,
                  mb: 2
                }}
              >
                {/* Left side */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Slide img */}
                  <CardMedia
                    component="img"
                    sx={{ width: 200 }}
                    image="/Slides/SlidesList.png"
                    alt="Slides image"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "column",
                      justifyContent: "space-between",
                      // margin: "auto",
                      p: "20px 0 20px 0"
                    }}
                  >
                    <Typography variant="h5">{item.title}</Typography>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Avatar src={user.data?.picture}></Avatar>
                      <Typography variant="h7">{user.data?.name}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Right side */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <CardActions sx={{ alignSelf: "end" }}>
                    <Delete
                      sx={{ cursor: "pointer" }}
                      color="error"
                      onClick={() => {
                        handleOpenConfirm();
                        setDelItem(item._id);
                      }}
                    />
                  </CardActions>
                  <CardActions>
                    <BasicButton
                      size="small"
                      width="100%"
                      icon={<Edit />}
                      variant="contained"
                      onClick={() =>
                        navigate(PAGE_ROUTES.PRESENTATION + `/${item._id}`)
                      }
                    >
                      Edit
                    </BasicButton>
                  </CardActions>
                </Box>
              </Card>
            ))}
          </List>
        ) : isLoading ? (
          <CircularProgress sx={{ m: "auto" }} />
        ) : (
          <Empty img={"/Groups/EmptyActivites.jpg"}>
            You haven't create any presentaion yet
          </Empty>
        )}

        {/* Create more slide */}
        <BasicButton
          icon={<AddCircle />}
          sx={{ m: "auto" }}
          onClick={handleOpenPopup}
        >
          Create presentation
        </BasicButton>
      </Paper>
      <div display="none" className="modal-presentation-list">
        {/* Popup create group */}
        <PopupForm
          isOpen={open}
          handleClose={handleClosePopup}
          refetch={refetch}
          api={API.CREATE_PRESENTAION}
          header="What will you call this presentation ?"
          label="Presentaion's name"
          fieldName="title"
        ></PopupForm>

        {/* Popup message on delete */}
        <PopupMsg
          status={status.type}
          isOpen={openMsgPopup}
          handleClosePopup={handleCloseMsgPopup}
          hideOnSuccess={true}
        >
          {status.msg}
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
    </>
  );
};

export default OwnedPresentation;
