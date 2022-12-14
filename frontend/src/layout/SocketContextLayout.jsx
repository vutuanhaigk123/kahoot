import React from "react";
import { Outlet } from "react-router-dom";
import { SocketProvider } from "../context/socket-context";

const SocketContextLayout = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};

export default SocketContextLayout;
