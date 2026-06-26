import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/**
 * AdminGuestOnly — blocks the /admin login page for users who are already
 * authenticated as ADMIN. Redirects them straight to their dashboard.
 * - Not logged in       → renders children (show admin login)
 * - ADMIN logged in     → /admin/veodashboard
 * - Non-ADMIN logged in → /dashboard (they shouldn't be here)
 */
const AdminGuestOnly = ({ children }: React.PropsWithChildren) => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);

  if (loading) return null;

  console.log(user?.data?.role);

  if (user?.data?.role === "ADMIN") return <Navigate to="/admin/veodashboard" replace />;


  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminGuestOnly;
