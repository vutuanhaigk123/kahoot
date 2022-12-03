import { Avatar, Box, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  API,
  NUM_TO_ROLE,
  PAGE_ROUTES,
  ROLE
} from "../../../../../commons/constants";
import usePopup from "../../../../../hooks/usePopup";
import { handleGet } from "../../../../../utils/fetch";
import PopupFormInvite from "../../../../../components/notification/PopUpFormInvite";
import Loading from "../../../../../components/Loading";
import { useSelector } from "react-redux";
import NotFound from "../../../../NotFound";
import UsersActions from "./UsersActions";
import BasicButton from "../../../../../components/button/BasicButton";
import { Group } from "@mui/icons-material";

const getUserRole = (uid, members) => {
  for (const member of members) {
    if (member._id === uid) {
      return member.role;
    }
    continue;
  }
};

const checkOwnerRole = (userRole) => {
  return userRole === ROLE.owner || userRole === ROLE.co_owner;
};

const MemberList = () => {
  const { user } = useSelector((state) => state.auth);
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const { id: groupId } = useParams();
  const [rowId, setRowId] = React.useState(null);
  const [userRole, setUserRole] = React.useState(-1);

  // Fetch data
  const { isLoading, error, data, refetch } = useQuery("group_detail", () =>
    handleGet(API.GROUP_DETAIL + `/${groupId}`)
  );

  React.useEffect(() => {
    if (data?.info && data?.info?.members) {
      const role = getUserRole(user?.data?.id, data?.info?.members);
      setUserRole(role);
    }
  }, [data?.info, data?.info?.members, user?.data?.id]);

  if (error) return "An error has occurred: " + error.message;

  if (data?.info === null) return <NotFound />;

  // Data grid column setup
  const columns = [
    {
      field: "photoURL",
      headerName: "",
      width: 60,
      renderCell: (params) => <Avatar src={params.row.photoURL} />,
      sortable: false,
      filterable: false
    },
    { field: "email", headerName: "Email", width: 300, flex: 1 },
    { field: "name", headerName: "Name", width: 100 },
    {
      field: "role",
      headerName: "Role",
      width: 100,
      type: "singleSelect",
      valueOptions: [
        { value: 1, label: "Co-owner" },
        { value: 2, label: "Member" },
        { value: -1, label: "Kick" }
      ],
      editable: checkOwnerRole(userRole),
      renderCell: (params) => (
        <Typography sx={{ cursor: "pointer", userSelect: "none" }}>
          {NUM_TO_ROLE[params.row.role]}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      renderCell: (params) => {
        if (params.row.role === ROLE.owner || params.row._id === user.data.id)
          return null;
        else
          return (
            <UsersActions {...{ params, rowId, setRowId, groupId, refetch }} />
          );
      },
      hide: userRole === ROLE.member
    }
  ];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Popup form */}
          <PopupFormInvite
            isOpen={open}
            handleClose={handleClosePopup}
            inviteLink={`${PAGE_ROUTES.BASE}${PAGE_ROUTES.JOIN}?id=${data.info.gId}&token=${data.info.inviteToken}`}
            groupId={groupId}
          ></PopupFormInvite>
          {/* Group header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2
            }}
          >
            <Typography variant="h4">{data?.info?.name}</Typography>
            {checkOwnerRole(userRole) ? (
              <BasicButton
                sx={{ minWidth: "100px", boxShadow: 4 }}
                icon={<Group />}
                onClick={handleOpenPopup}
              >
                Invite
              </BasicButton>
            ) : null}
          </Box>
          {/* Group data grid */}
          <Paper elevation={10}>
            <DataGrid
              autoHeight
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              rows={data?.info?.members}
              getRowId={(row) => row._id}
              columns={columns}
              disableSelectionOnClick
              onCellEditCommit={(params) => setRowId(params.id)}
              // experimentalFeatures={{ newEditingApi: true }}
              isCellEditable={(params) => {
                return (
                  params.row.email !== user.data.email &&
                  params.row.role !== ROLE.owner
                );
              }}
              rowHeight={70}
            />
          </Paper>
        </>
      )}
    </>
  );
};

export default MemberList;
