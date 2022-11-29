import React from "react";

const usePopup = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClosePopup = () => {
    setOpen(false);
  };

  return { open, handleOpenPopup, handleClosePopup };
};

export default usePopup;
