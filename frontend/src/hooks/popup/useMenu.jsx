import React from "react";

const useMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return { anchorEl, handleOpenMenu, handleCloseMenu };
};

export default useMenu;
