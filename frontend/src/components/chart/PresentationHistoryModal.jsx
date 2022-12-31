import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import Transition from "../../pages/presentation/modal/components/Transition";
import { grey } from "@mui/material/colors";
import { convertTS } from "./../../utils/convertTime";

const PresentationHistoryModal = ({
  isOpen,
  handleClose,
  data,
  currentAnsw
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
    >
      <DialogContent>
        {/* Ansers title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            position: "sticky",
            top: 0,
            bgcolor: "white"
          }}
        >
          {currentAnsw}
        </Typography>
        {data.length === 0 ? (
          <Typography variant="h6">There is no answers yet</Typography>
        ) : (
          <>
            {/* User info */}
            <Stack
              maxWidth="100%"
              rowGap={2}
              maxHeight="60vh"
              sx={{ overflow: "scroll" }}
            >
              {data.map((item, index) => (
                <div key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      gap: 1,
                      justifyContent: "space-between"
                    }}
                  >
                    <Stack>
                      <Typography>{item.name}</Typography>
                      <Typography variant="caption" color={grey[500]}>
                        {item.email}
                      </Typography>
                    </Stack>
                    <Typography color={grey[500]}>
                      {convertTS(item.ts)}
                    </Typography>
                  </Box>
                  {index === data.length - 1 ? null : <Divider flexItem />}
                </div>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PresentationHistoryModal;
