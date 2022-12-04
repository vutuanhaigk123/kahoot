import { Paper } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import BasicButton from "../../../../components/button/BasicButton";
import { AddCircle } from "@mui/icons-material";
import PopupForm from "../../../../components/notification/PopupForm";
import usePopup from "../../../../hooks/usePopup";

const SideBar = () => {
  const { open, handleOpenPopup, handleClosePopup } = usePopup();

  // To-do
  // React query lấy dữ liệu

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
      {/* Item */}
      <Paper
        sx={{
          width: "80%",
          height: "20%",
          m: "auto",
          border: 1,
          borderColor: grey[400],
          mb: 2
        }}
      ></Paper>
      {/* Add slide button */}
      <BasicButton onClick={handleOpenPopup} icon={<AddCircle />} fullWidth>
        Add slide
      </BasicButton>
      <PopupForm
        isOpen={open}
        handleClose={handleClosePopup}
        // refetch={refetch}
        // api={API.CREATE_GROUP}
        header="Please enter your slide's question"
        label="Slide's question"
      ></PopupForm>
    </Paper>
  );
};

export default SideBar;
