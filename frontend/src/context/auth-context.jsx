import React from "react";
import { useContext } from "react";
import { createContext } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = React.useState({});
  const value = [user, setUser];
  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used withing a AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
