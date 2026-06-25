import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

type AuthorizationRoleProps = {
  children: JSX.Element;
  allowedRoles: string[];
};

const AuthorizationRole: React.FC<AuthorizationRoleProps> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if the user's role is in the allowed roles
  if (!user.role || !allowedRoles.includes(user.role)) {
    // Redirect to login or unauthorized page if the role is not allowed
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthorizationRole;