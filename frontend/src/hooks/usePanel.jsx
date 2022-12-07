import React from "react";

const usePanel = (defaultValue) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleSwitchPanel = (event, newValue) => {
    setValue(newValue);
  };
  return { value, handleSwitchPanel };
};

export default usePanel;
