import React from "react";
import { useContext } from "react";
import { createContext } from "react";

const SocketContext = createContext();

const SocketProvider = (props) => {
  const [socketContext, setSocketContext] = React.useState(null);
  const [groupSocketContext, setGroupSocketContext] = React.useState(null);
  const value = {
    socketContext,
    setSocketContext,
    groupSocketContext,
    setGroupSocketContext
  };
  return (
    <SocketContext.Provider value={value} {...props}></SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (typeof context === "undefined")
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export { SocketProvider, useSocket };
