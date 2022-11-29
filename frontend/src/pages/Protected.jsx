import { Navigate } from "react-router-dom";
import { PAGE_ROUTES } from "../commons/constants";

const Protected = ({ isLoggedIn, isStopWhenLogon, children }) => {
  if (!isLoggedIn && !isStopWhenLogon) {
    return <Navigate to={PAGE_ROUTES.LOGIN} replace />;
  }
  if (isLoggedIn && isStopWhenLogon) {
    return <Navigate to={PAGE_ROUTES.HOME} replace />;
  }
  return children;
};
export default Protected;
