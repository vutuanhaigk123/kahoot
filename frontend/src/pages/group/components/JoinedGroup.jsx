import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { API, PAGE_ROUTES } from "../../../commons/constants";
import BasicCard from "../../../components/card/BasicCard";
import { handleGet } from "../../../utils/fetch";
import Empty from "./Empty";

const JoinedGroup = () => {
  const { error, data, isLoading } = useQuery("joined-groups", () =>
    handleGet(`${API.JOINED_GROUP}?page=${0}&limit=${10}`)
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}
    >
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
                  canDelete={false}
                ></BasicCard>
              </Grid>
            ))}
          </Grid>
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <Empty>You haven't joined any group yet</Empty>
        )}
      </Paper>
    </Box>
  );
};

export default JoinedGroup;
