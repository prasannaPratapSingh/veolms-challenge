import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/**
 * GuestOnly — redirects authenticated users away from public-only pages
 * (login, signup). If the user is already logged in they go to /dashboard.
 */
const GuestOnly = ({ children }: React.PropsWithChildren) => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);

  // Wait for the initial getMe check to finish before deciding
  if (loading) return null;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

export default GuestOnly;
