import React from "react";

const useToggle = (defaultValue) => {
  const [value, setValue] = React.useState(defaultValue);

  const toggleValue = (value) => {
    setValue((currentValue) =>
      typeof value === "boolean" ? value : !currentValue
    );
  };
  return { value, toggleValue };
};

export default useToggle;
