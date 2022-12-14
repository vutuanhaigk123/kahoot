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
import { PAGE_ROUTES, WS_CMD, WS_EVENT } from "../../commons/constants";
import { useQuery } from "react-query";
import { API } from "../../commons/constants";
import { TabContext, TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { handleGet } from "../../utils/fetch";
import Empty from "./components/Empty";
import { useSocket } from "../../context/socket-context";
import { io } from "socket.io-client";

const FormType = { CREATE: "create", JOIN: "join" };

const GroupPage = () => {
  const [value, setValue] = React.useState("1");
  const { socketContext, setSocketContext } = useSocket();

  React.useEffect(() => {
    let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
    if (window.location.hostname.includes("localhost")) {
      wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
    }
    if (!socketContext) {
      const newSocket = io(wsDomain, {
        withCredentials: true
      });

      // Connect
      newSocket.on("connect", () => {
        setSocketContext(newSocket);
        newSocket.emit(WS_EVENT.INIT_CONNECTION_EVENT, {
          cmd: WS_CMD.CREATE_ROOM_CMD,
          room: "638d2ceac40e99606e367f5c",
          slide: "638ddedc4ec43c37ee600ae2"
        });
      });
    }
    return () => {
      if (socketContext) {
        socketContext.off("connect");
      }
    };
  }, []);

  React.useEffect(() => {
    // Init
    if (socketContext) {
      socketContext.on(WS_EVENT.INIT_CONNECTION_EVENT, (arg) => {
        console.log("==========================================");
        console.log(arg);
      });
      return () => {
        socketContext.off(WS_EVENT.INIT_CONNECTION_EVENT);
      };
    }
  }, [socketContext]);

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
    handleGet(`${API.CREATED_GROUP}?page=${0}&limit=${10}`)
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
        {formType === FormType.CREATE ? (
          <PopupForm
            isOpen={open}
            handleClose={handleClosePopup}
            refetch={refetch}
            api={API.CREATE_GROUP}
            header="What will we call your group ?"
            label="Group's name"
          ></PopupForm>
        ) : null}

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
