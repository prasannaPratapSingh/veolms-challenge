import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/**
 * AdminOnly — allows access only if the user is authenticated AND has role === "ADMIN".
 * - Not logged in         → /admin (admin login)
 * - Logged in, not ADMIN  → /dashboard (regular user area)
 * - Logged in, ADMIN      → renders children
 */
const AdminOnly = ({ children }: React.PropsWithChildren) => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);

  if (loading) return null;

  if (!user) return <Navigate to="/admin" replace />;

  if (user?.data?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminOnly;
