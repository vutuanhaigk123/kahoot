import { Check, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab } from "@mui/material";
import React from "react";
import { API } from "../../../../../commons/constants";
import { handlePost } from "../../../../../utils/fetch";

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

export default UsersActions;
