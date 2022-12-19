import React from "react";
import usePopup from "./../../../../hooks/usePopup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useStatus from "../../../../hooks/useStatus";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import PopupMsg from "../../../../components/notification/PopupMsg";
import TextBox from "../../../../components/input/TextBox";
import BasicButton from "../../../../components/button/BasicButton";
import Transition from "./../../modal/components/Transition";
import { grey } from "@mui/material/colors";
import { PersonRemove } from "@mui/icons-material";
import { handlePost } from "../../../../utils/fetch";
import { API } from "../../../../commons/constants";
import { useSelector } from "react-redux";
import Empty from "../../../group/components/Empty";
import ConfirmPopup from "../../../../components/notification/ConfirmPopup";

const CollabPopup = ({ isOpen, handleClose, refetch }) => {
  // Form
  const schema = yup.object({
    email: yup.string().email().required("Required")
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const presentation = useSelector((state) => state.presentation);

  // Handle add
  const { status: statusAdd, handleStatus: handleStatusAdd } = useStatus();
  const { id: presentationId } = useParams();
  const {
    open: openAddMsg,
    handleClosePopup: handleCloseAddMsg,
    handleOpenPopup: handleOpenAddMsg
  } = usePopup();
  const [isAdding, setIsAdding] = React.useState(false);
  const handleAdd = async (data) => {
    // Process data
    data.presentationId = presentationId;

    console.log(data);

    // Handle submit
    setIsAdding(true);
    const resp = await handlePost(API.PRESENTATION_ADD_COLLAB, data);
    handleStatusAdd(resp, "Invite success");

    // Open popup resp message
    handleOpenAddMsg();

    // Reset invite textbox
    reset();

    // Refetch data
    refetch();
    setIsAdding(false);
  };

  // Handle Delete
  const { status: statusDel, handleStatus: handleStatusDel } = useStatus();
  const {
    open: openDelMsg,
    handleClosePopup: handleCloseDelMsg,
    handleOpenPopup: handleOpenDelMsg
  } = usePopup();
  const {
    open: openConfirmMsg,
    handleClosePopup: handleCloseConfirmMsg,
    handleOpenPopup: handleOpenConfirmMsg
  } = usePopup();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [delId, setDelId] = React.useState(null);
  const handleDelete = async () => {
    // Process data
    const data = {
      presentationId,
      collaboratorId: delId
    };
    console.log(data);

    // Handle submit
    setIsDeleting(true);
    const resp = await handlePost(API.PRESENTATION_DELETE_COLLAB, data);
    handleStatusDel(resp, "");

    // Open popup resp message if fail
    handleOpenDelMsg();
    handleCloseConfirmMsg();

    // Refetch data
    refetch();
    setIsDeleting(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        sx={{ zIndex: 800 }}
      >
        <DialogTitle>Collaborators</DialogTitle>
        <DialogContent>
          <Stack
            sx={{
              border: 1,
              mb: 2,
              borderColor: grey[400],
              p: 1,
              gap: 2,
              borderRadius: 1
            }}
          >
            {/* Collab email list */}
            {presentation.collaborators?.length > 0 ? (
              presentation.collaborators.map((item, index) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* Collab info */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {/* Avatar */}
                      <Avatar></Avatar>
                      {/* User info */}
                      <Stack>
                        <Typography variant="h7">{item.name}</Typography>
                        <Typography variant="caption" color={grey[500]}>
                          {item.email}
                        </Typography>
                      </Stack>
                    </Box>
                    {/* Remove collab */}
                    <PersonRemove
                      color="error"
                      onClick={() => {
                        setDelId(item.id);
                        handleOpenConfirmMsg();
                      }}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                  {index !== presentation.collaborators.length - 1 ? (
                    <Divider orientation="horizontal" flexItem sx={{ mt: 1 }} />
                  ) : null}
                </Box>
              ))
            ) : (
              <Empty img={"/Presentation/empty-collab.png"}>
                You haven't invite anyone yet
              </Empty>
            )}
          </Stack>
          {/* Add collab */}
          <form
            onSubmit={handleSubmit(handleAdd)}
            style={{ display: "flex", alignItems: "start" }}
          >
            <TextBox
              label="Email"
              type="email"
              helperText={errors.email ? errors.email.message : ""}
              name="email"
              control={control}
            />
            <BasicButton sx={{ height: 40 }} type="submit" loading={isAdding}>
              Invite
            </BasicButton>
          </form>
        </DialogContent>
      </Dialog>
      <div className="modal-collab">
        {/* Add modal */}
        <PopupMsg
          status={statusAdd.type}
          isOpen={openAddMsg}
          handleClosePopup={handleCloseAddMsg}
          sx={{ zIndex: 1000 }}
        >
          {statusAdd.msg}
        </PopupMsg>
        {/* Delete modal */}
        <PopupMsg
          status={statusDel.type}
          isOpen={openDelMsg}
          handleClosePopup={handleCloseDelMsg}
          sx={{ zIndex: 1000 }}
          hideOnSuccess={true}
        >
          {statusDel.msg}
        </PopupMsg>
        {/* Confirm modal */}
        <ConfirmPopup
          isOpen={openConfirmMsg}
          handleClose={handleCloseConfirmMsg}
          handleDelete={() => handleDelete(delId)}
          isDeleting={isDeleting}
        ></ConfirmPopup>
      </div>
    </>
  );
};

export default CollabPopup;
