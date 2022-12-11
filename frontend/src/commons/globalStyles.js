import { grey } from "@mui/material/colors";

export const iconButton = {
  bgcolor: grey[300],
  borderRadius: "50%",
  color: "black",
  p: "5px",
  // marginTop: "6px",
  cursor: "pointer"
};

export const iconHover = (bgcolor = "primary.main") => ({
  "&:hover": {
    bgcolor,
    color: "white"
  }
});
