/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { API } from "../../../commons/constants";
import BackgroundContainer from "../../../components/misc/BackgroundContainer";
import { handleGet } from "../../../utils/fetch";
import NotFound from "../../NotFound";
import MemberList from "./components/member-list-tab/MemberList";
import { setGroup } from "../../../redux-toolkit/groupSlice";
import GroupHeader from "./components/header/GroupHeader";

const getUserRole = (uid, members) => {
  for (const member of members) {
    if (member._id === uid) {
      return member.role;
    }
    continue;
  }
};

const GroupDetailPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { id: groupId } = useParams();

  // Fetch data
  const { error, data, refetch } = useQuery("group_detail", () =>
    handleGet(API.GROUP_DETAIL + `/${groupId}`)
  );
  const [userRole, setUserRole] = React.useState(-1);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data?.status === 0) {
      dispatch(setGroup(data.info));
    }
  }, [data]);

  React.useEffect(() => {
    if (data) {
      const role = getUserRole(user?.data?.id, data?.info?.members);
      setUserRole(role);
    }
  }, [data]);

  if (error) return "An error has occurred: " + error.message;

  if (data?.info === null) return <NotFound />;

  return (
    <BackgroundContainer>
      <Stack
        sx={{
          margin: "auto",
          width: "60%",
          gap: 2
        }}
      >
        {/* Group header */}
        <GroupHeader userRole={userRole} />

        {/* Datagrid */}
        <MemberList userRole={userRole} refetch={refetch}></MemberList>
      </Stack>
    </BackgroundContainer>
  );
};

export default GroupDetailPage;
