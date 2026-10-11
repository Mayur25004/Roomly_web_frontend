import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/rooms" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
