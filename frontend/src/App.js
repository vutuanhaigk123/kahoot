/* eslint-disable no-undef */
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignUpPage.jsx";
import BasicLayout from "./layout/BasicLayout";
import SignInPage from "./pages/SignInPage";
import { AuthProvider } from "./context/auth-context";
import { PAGE_ROUTES } from "./commons/constants";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Header */}
        <Route element={<BasicLayout></BasicLayout>}>
          <Route
            path={PAGE_ROUTES.HOME}
            element={<HomePage></HomePage>}
          ></Route>
          <Route
            path={PAGE_ROUTES.REGISTER}
            element={<SignupPage></SignupPage>}
          />
          <Route path={PAGE_ROUTES.LOGIN} element={<SignInPage></SignInPage>} />
          <Route path="*" element={<div>404 page</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
