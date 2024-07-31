// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Navigate } from "react-router-dom";
import { getCredentials } from "../services/User";

/**
 * PrivateRoute is a functional component that checks user credentials and redirects to login if not authenticated.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The children elements to be rendered if user is authenticated.
 *
 * @returns {JSX.Element} The children elements if user is authenticated, otherwise redirects to login.
 */
const PrivateRoute = ({ children }: any) => {
  const user = getCredentials();
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default PrivateRoute;
