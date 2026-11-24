import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAdmin() {
  const { user, role, loading } = useAuth();

  if (loading) return <Center mih={280}><Loader aria-label="Cargando sesión" /></Center>;
  if (!user) return <Navigate to="/?cuenta=admin" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
