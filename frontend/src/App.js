/* eslint-disable no-undef */
import React, { lazy, Suspense } from "react";
import "./App.css";
// import { useEffect } from "react";
// import { useState } from "react";
// import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { PAGE_ROUTES } from "./commons/constants";
// import { Skeleton } from "@mui/material";
import BackgroundContainer from "./components/misc/BackgroundContainer";
import Protected from "./pages/Protected";
import Loading from "./components/Loading";

const DELAY_TIME = 500;
const HomePage = lazy(() =>
  Promise.all([
    import("./pages/HomePage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const BasicLayout = lazy(() =>
  Promise.all([
    import("./layout/BasicLayout.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const SignupPage = lazy(() =>
  Promise.all([
    import("./pages/SignUpPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const SignInPage = lazy(() =>
  Promise.all([
    import("./pages/SignInPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const VerifyEmailPage = lazy(() =>
  Promise.all([
    import("./pages/VerifyEmailPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const GroupPage = lazy(() =>
  Promise.all([
    import("./pages/group/GroupPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const ProfilePage = lazy(() =>
  Promise.all([
    import("./pages/ProfilePage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const GroupDetailPage = lazy(() =>
  Promise.all([
    import("./pages/group/GroupDetailPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const AcceptInvitePage = lazy(() =>
  Promise.all([
    import("./pages/group/AcceptInvitePage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);

function App() {
  // const [ws, setWs] = useState(null);
  // useEffect(() => {
  //   let wsDomain = process.env.REACT_APP_BACKEND_DOMAIN;
  //   if (window.location.hostname.includes("localhost")) {
  //     wsDomain = process.env.REACT_APP_BACKEND_DOMAIN_DEV;
  //   }
  //   const cmd = 2;
  //   const room = -1;
  //   const JOIN_ROOM_EVENT = "2";
  //   const INIT_CONNECTION_EVENT = "1";
  //   const EXIT_ROOM_EVENT = "-2";
  //   const socket = io(wsDomain, {
  //     query: `cmd=${cmd}&room=${room}`,
  //     withCredentials: true
  //   });
  //   socket.on(INIT_CONNECTION_EVENT, (arg) => {
  //     console.log("==========================================");
  //     console.log(arg);
  //   });

  //   socket.on(JOIN_ROOM_EVENT, (arg) => {
  //     console.log(
  //       "=====================Member has just joined room====================="
  //     );
  //     console.log(arg);
  //   });

  //   socket.on(EXIT_ROOM_EVENT, (arg) => {
  //     console.log(
  //       "=====================Member has just leaved room====================="
  //     );
  //     console.log(arg);
  //   });

  //   setWs(socket);
  //   return () => socket.close();
  // }, []);
  const { user } = useSelector((state) => state.auth);
  return (
    <Suspense
      fallback={
        <BackgroundContainer isWithNavBar={false}>
          <Loading />
        </BackgroundContainer>
      }
    >
      <Routes>
        {/* Header */}
        <Route element={<BasicLayout></BasicLayout>}>
          <Route
            path={PAGE_ROUTES.HOME}
            element={<HomePage></HomePage>}
          ></Route>
          <Route
            path={PAGE_ROUTES.VERIFY_EMAIL}
            element={<VerifyEmailPage></VerifyEmailPage>}
          />
          {/*================================= stop when logon ========================================*/}
          <Route
            path={PAGE_ROUTES.REGISTER}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={true}>
                <SignupPage />
              </Protected>
            }
          />
          <Route
            path={PAGE_ROUTES.LOGIN}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={true}>
                <SignInPage />
              </Protected>
            }
          />
          {/*================================= stop when logon ========================================*/}

          {/*================================= stop when NOT logon ====================================*/}
          <Route
            path={PAGE_ROUTES.GROUP}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                <GroupPage />
              </Protected>
            }
          />
          <Route
            path={PAGE_ROUTES.PROFILE}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path={PAGE_ROUTES.GROUP_DETAIL}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                <GroupDetailPage />
              </Protected>
            }
          />
          <Route
            path={PAGE_ROUTES.JOIN}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                <AcceptInvitePage />
              </Protected>
            }
          />
          {/*================================= stop when NOT logon ====================================*/}

          <Route path="*" element={<div>404 page</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
