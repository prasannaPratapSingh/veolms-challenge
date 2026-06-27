import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/**
 * GuestOnly — redirects authenticated users away from public-only pages
 * (login, signup). If the user is already logged in they go to /dashboard.
 */
const GuestOnly = ({ children }: React.PropsWithChildren) => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);

  // Still resolving session — show nothing to avoid flash of login form
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in — send to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default GuestOnly;
