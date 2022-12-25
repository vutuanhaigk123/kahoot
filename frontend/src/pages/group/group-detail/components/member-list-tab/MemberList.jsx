import { Avatar, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useParams } from "react-router-dom";
import { NUM_TO_ROLE, ROLE } from "../../../../../commons/constants";
import { useSelector } from "react-redux";
import UsersActions from "./UsersActions";

const MemberList = ({ refetch, userRole }) => {
  const { user } = useSelector((state) => state.auth);
  const { id: groupId } = useParams();
  const [rowId, setRowId] = React.useState(null);
  const group = useSelector((state) => state.group);

  const isYou = (id) => {
    return id === user.data.id;
  };

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
      editable: userRole === ROLE.co_owner || userRole === ROLE.owner,
      renderCell: (params) => (
        <Typography
          sx={{
            cursor: "pointer",
            userSelect: "none",
            fontWeight: isYou(params.row._id) ? "bold" : null
          }}
        >
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
    <Paper
      elevation={10}
      sx={{
        "& .row--you": {
          fontWeight: "bold"
        }
      }}
    >
      <DataGrid
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 20]}
        rows={group.members || []}
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
        getRowClassName={(params) => {
          if (params.row._id === user.data.id) {
            return "row--you";
          }
          switch (params.row.role) {
            case ROLE.owner:
              return "row--owner";
            default:
              return;
          }
        }}
      />
    </Paper>
  );
};

export default MemberList;
