import React from "react";
import BackgroundContainer from "../components/misc/BackgroundContainer";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { TabList } from "@mui/lab";
import { useDispatch } from "react-redux";
import { API } from "../commons/constants";
import EditProfileForm from "./../components/form/EditProfileForm";
import { useQuery } from "react-query";
import { handleGet } from "../utils/fetch";
import { update } from "../redux-toolkit/authSlice";
import ChangePassForm from "./../components/form/ChangePassForm";

const ProfilePage = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const {
    isLoading,
    error: userInfoErr,
    data: userInfo,
    refetch
  } = useQuery("userInfo", () => handleGet(API.PROFILE));

  // Update data in localStorage
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!userInfoErr && userInfo?.info) {
      dispatch(update(userInfo.info));
    }
  }, [dispatch, userInfo, userInfoErr]);

  if (userInfoErr) return "An error has occurred: " + userInfoErr.message;

  return (
    <BackgroundContainer>
      <Box
        sx={{
          margin: "auto",
          width: "50%",
          gap: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Tab header */}
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Edit profile" value="1" />
              {userInfo?.info?.provider !== "google" ? (
                <Tab label="Change password" value="2" />
              ) : null}
            </TabList>
          </Box>
          {/* Tab content */}
          <TabPanel value={"1"}>
            {userInfo ? (
              <EditProfileForm
                userInfo={userInfo.info}
                refetch={() => refetch()}
              ></EditProfileForm>
            ) : null}
          </TabPanel>
          {userInfo?.info?.provider !== "google" ? (
            <TabPanel value={"2"}>
              <ChangePassForm></ChangePassForm>
            </TabPanel>
          ) : null}
        </TabContext>
      </Box>
    </BackgroundContainer>
  );
};

export default ProfilePage;
