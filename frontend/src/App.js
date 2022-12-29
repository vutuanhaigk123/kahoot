/* eslint-disable no-undef */
import React, { lazy, Suspense } from "react";
import "./App.css";
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
    import("./pages/authen/SignUpPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const SignInPage = lazy(() =>
  Promise.all([
    import("./pages/authen/SignInPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const VerifyEmailPage = lazy(() =>
  Promise.all([
    import("./pages/authen/VerifyEmailPage.jsx"),
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
    import("./pages/group/group-detail/GroupDetailPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const AcceptInvitePage = lazy(() =>
  Promise.all([
    import("./pages/group/AcceptInvitePage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const PresentationOwnerPage = lazy(() =>
  Promise.all([
    import("./pages/presentation/PresentationOwnerPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const PresentationCoOwnerPage = lazy(() =>
  Promise.all([
    import("./pages/presentation/PresentationCoOwnerPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const PresentationPlayerPage = lazy(() =>
  Promise.all([
    import("./pages/presentation/PresentationPlayerPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const PresentationEdit = lazy(() =>
  Promise.all([
    import("./pages/presentation/edit/PresentationEditPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const PresentationListPage = lazy(() =>
  Promise.all([
    import("./pages/presentation/presentaion-list/PresentationListPage.jsx"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const SocketContextLayout = lazy(() =>
  Promise.all([
    import("./layout/SocketContextLayout"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const ResetPassPage = lazy(() =>
  Promise.all([
    import("./pages/authen/ResetPassPage"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);
const NotFound = lazy(() =>
  Promise.all([
    import("./pages/NotFound"),
    new Promise((resolve) => setTimeout(resolve, DELAY_TIME))
  ]).then(([module]) => module)
);

function App() {
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
          <Route
            path={PAGE_ROUTES.RESET_PASSWORD}
            element={
              <Protected isLoggedIn={user?.data} isStopWhenLogon={true}>
                <ResetPassPage />
              </Protected>
            }
          />

          {/*================================= stop when logon ========================================*/}

          {/*================================= stop when NOT logon ====================================*/}
          <Route element={<SocketContextLayout></SocketContextLayout>}>
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
            <Route
              path={PAGE_ROUTES.PRESENT_OWNER}
              element={
                <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                  <PresentationOwnerPage />
                </Protected>
              }
            />
            <Route
              path={PAGE_ROUTES.PRESENT_CO_OWNER}
              element={
                <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                  <PresentationCoOwnerPage />
                </Protected>
              }
            />
            <Route
              path={PAGE_ROUTES.PRESENT_PLAYER}
              element={
                <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                  <PresentationPlayerPage />
                </Protected>
              }
            />
            <Route
              path={PAGE_ROUTES.PRESENTATION}
              element={
                <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                  <PresentationListPage />
                </Protected>
              }
            />
            <Route
              path={PAGE_ROUTES.PRESENTATION_EDIT}
              element={
                <Protected isLoggedIn={user?.data} isStopWhenLogon={false}>
                  <PresentationEdit />
                </Protected>
              }
            />
          </Route>
          {/*================================= stop when NOT logon ====================================*/}

          <Route path="*" element={<NotFound></NotFound>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
