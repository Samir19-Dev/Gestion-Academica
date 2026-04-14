import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const mustChangePassword =
    localStorage.getItem("mustChangePassword") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (mustChangePassword && location.pathname !== "/cambiar-clave") {
    return <Navigate to="/cambiar-clave" replace />;
  }

  if (!mustChangePassword && location.pathname === "/cambiar-clave") {
    return (
      <Navigate
        to={role === "ROLE_ESTUDIANTE" ? "/boletin" : "/dashboard"}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "ROLE_ESTUDIANTE" ? "/boletin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;