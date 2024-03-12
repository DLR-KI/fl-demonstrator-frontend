import { Navigate } from "react-router-dom";
import { userService } from "../services/User";


const PrivateRoute = ({ children }: any) => {
  const user = userService.getCredentials();
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default PrivateRoute;
