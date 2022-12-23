import React from "react";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import BasicButton from "../../components/button/BasicButton";
import { Box, Grid, Paper, Tab } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import BasicCard from "../../components/card/BasicCard";
import PopupForm from "../../components/notification/PopupForm";
import usePopup from "../../hooks/usePopup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTES } from "../../commons/constants";
import { useQuery } from "react-query";
import { API } from "../../commons/constants";
import { TabContext, TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { handleGet } from "../../utils/fetch";
import Empty from "./components/Empty";

const FormType = { CREATE: "create", JOIN: "join" };

const GroupPage = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Check login
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!user?.data) {
      navigate(PAGE_ROUTES.LOGIN);
    }
  });

  // Get groups
  const {
    isLoading: isLoadingCreated,
    error: errorCreated,
    data: createdGroup,
    refetch
  } = useQuery("created-groups", () =>
    handleGet(`${API.CREATED_GROUP}?page=${0}&limit=${100}`)
  );

  const {
    isLoading: isLoadingJoined,
    error: errorJoined,
    data: joinedGroup
  } = useQuery("joined-groups", () =>
    handleGet(`${API.JOINED_GROUP}?page=${0}&limit=${100}`)
  );

  if (errorCreated) return "An error has occurred: " + errorCreated.message;
  if (errorJoined) return "An error has occurred: " + errorJoined.message;

  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "40%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Owned group" value="1" />
              <Tab label="Joined group" value="2" />
            </TabList>
          </Box>
          <Panel
            value={"1"}
            data={createdGroup}
            formType={FormType.CREATE}
            refetch={refetch}
          ></Panel>
          <Panel
            value={"2"}
            data={joinedGroup}
            formType={FormType.JOIN}
          ></Panel>
        </TabContext>
      </Box>
    </BackgroundContainer>
  );
};

const Panel = ({ value, data, formType, refetch }) => {
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  return (
    <TabPanel
      value={value}
      sx={{
        p: 0
      }}
    >
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
          refetch={refetch}
          api={API.CREATE_GROUP}
          header="What will we call your group ?"
          label="Group's name"
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
                  ></BasicCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Empty>
              {formType === FormType.CREATE
                ? "You don't onwed any group yet"
                : "You haven't joined any group yet"}
            </Empty>
          )}
        </Paper>
        {/* Add group button */}
        {formType === FormType.CREATE ? (
          <BasicButton
            sx={{ m: "auto", boxShadow: 4 }}
            onClick={handleOpenPopup}
            icon={<AddCircle />}
          >
            Create group
          </BasicButton>
        ) : null}
      </Box>
    </TabPanel>
  );
};

export default GroupPage;
