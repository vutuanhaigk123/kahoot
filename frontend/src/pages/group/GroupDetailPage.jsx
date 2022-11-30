import {
  Avatar,
  Box,
  CircularProgress,
  Fab,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import BackgroundContainer from "../../components/misc/BackgroundContainer";
import BasicButton from "../../components/button/BasicButton";
import { Group as GroupIcon, Check, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import { API, PAGE_ROUTES, ROLE } from "../../commons/constants";
import { handleGet } from "../../utils/fetch";
import usePopup from "../../hooks/usePopup";
import PopupFormInvite from "../../components/notification/PopUpFormInvite";
import { handlePost } from "../../utils/fetch";
import { useSelector } from "react-redux";
import { NUM_TO_ROLE } from "./../../commons/constants";
import NotFound from "../NotFound";
import Loading from "../../components/Loading";

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

const GroupDetailPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { id: groupId } = useParams();
  const { open, handleClosePopup, handleOpenPopup } = usePopup();
  const { isLoading, error, data, refetch } = useQuery("group_detail", () =>
    handleGet(API.GROUP_DETAIL + `/${groupId}`)
  );
  const [rowId, setRowId] = React.useState(null);
  const [userRole, setUserRole] = React.useState(-1);

  React.useEffect(() => {
    if (data?.info && data?.info?.members) {
      const role = getUserRole(user?.data?.id, data?.info?.members);
      setUserRole(role);
    }
  }, [data?.info, data?.info?.members, user?.data?.id]);

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

  if (error) return "An error has occurred: " + error.message;

  if (isLoading)
    return (
      <BackgroundContainer>
        <Loading />
      </BackgroundContainer>
    );
  else {
    return data?.info === null ? (
      <NotFound />
    ) : (
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
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h4">{data?.info?.name}</Typography>
            {checkOwnerRole(userRole) ? (
              <BasicButton
                margin="0"
                width="15%"
                icon={<GroupIcon />}
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
        </Box>
      </BackgroundContainer>
    );
  }
};

const UsersActions = ({ params, rowId, setRowId, groupId, refetch }) => {
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Get the data
    var updatedData = {};
    const { _id, role } = params.row;
    const members = [{ id: _id, role }];
    updatedData.members = JSON.stringify(members);
    updatedData.groupId = groupId;

    // Post the data
    const resp = await handlePost(API.MEMBER_UPDATE, updatedData);
    console.log(
      "🚀 ~ file: GroupDetailPage.jsx ~ line 170 ~ handleSubmit ~ resp",
      resp
    );

    if (resp) {
      setSuccess(true);
      setRowId(null);
      refetch();
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [params.id, rowId, success]);

  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
        cursor: "pointer"
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: "success.main",
            "&:hover": { bgcolor: "success.light" }
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit}
        >
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: "success.main",
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1
          }}
        />
      )}
    </Box>
  );
};

export default GroupDetailPage;
