import { AddCircle } from "@mui/icons-material";
import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { API, PAGE_ROUTES } from "../../../commons/constants";
import BasicButton from "../../../components/button/BasicButton";
import BasicCard from "../../../components/card/BasicCard";
import PopupForm from "../../../components/notification/PopupForm";
import usePopup from "../../../hooks/usePopup";
import { handleGet } from "../../../utils/fetch";
import Empty from "./Empty";

const CreatedGroup = () => {
  const { error, data, isLoading, refetch } = useQuery(
    ["created-groups"],
    () => handleGet(`${API.CREATED_GROUP}?page=${0}&limit=${10}`),
    { refetchInterval: 2000 }
  );

  const { open, handleClosePopup, handleOpenPopup } = usePopup();

  if (error) return "An error has occurred: " + error.message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
      {/* Form to create group */}
      <PopupForm
        isOpen={open}
        handleClose={handleClosePopup}
        api={API.CREATE_GROUP}
        header="What will we call your group ?"
        label="Group's name"
        refetch={refetch}
      />

      {/* Group grid */}
      <Paper
        sx={{
          p: 6,
          display: "flex",
          justifyContent: "center"
        }}
        elevation={5}
      >
        {data?.info ? (
          <Grid container spacing={2}>
            {data.info.groups.map((item) => (
              <Grid item key={item._id} xs={6}>
                <BasicCard
                  data={item}
                  navigateTo={PAGE_ROUTES.GROUP + `/${item._id}`}
                  canDelete={true}
                  refetch={refetch}
                ></BasicCard>
              </Grid>
            ))}
          </Grid>
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <Empty>You don't onwed any group yet</Empty>
        )}
      </Paper>
      {/* Add group button */}
      <BasicButton
        sx={{ m: "auto", boxShadow: 4 }}
        onClick={handleOpenPopup}
        icon={<AddCircle />}
      >
        Create group
      </BasicButton>
    </Box>
  );
};

export default CreatedGroup;
