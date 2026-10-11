import type { ReactNode } from "react";
import type { CurrentUser, UserRole } from "../types/models.ts";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({
  user,
  requiredRole,
  children,
}: {
  user: CurrentUser | null;
  requiredRole?: UserRole;
  children?: ReactNode;
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/rooms" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
