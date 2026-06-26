import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import { useNavigate } from "react-router";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function VeoDashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/admin", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: "antialiased",
        color: "#fff",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          height: "60px",
          background: "#111",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.03em",
          }}
        >
          veo<span style={{ opacity: 0.35 }}>lms</span>{" "}
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderLeft: "1px solid rgba(255,255,255,0.12)",
              paddingLeft: "0.6rem",
              marginLeft: "0.3rem",
            }}
          >
            Admin
          </span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>
            {user?.email}
          </span>
          <motion.button
            onClick={onLogout}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Sign out
          </motion.button>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.25rem 0.75rem",
              borderRadius: "100px",
              marginBottom: "1.2rem",
            }}
          >
            Admin Dashboard
          </span>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            Welcome back,{" "}
            <span style={{ color: "rgba(255,255,255,0.55)" }}>
              {user?.name ?? "Admin"}
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: "3rem" }}>
            You're signed in as{" "}
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>{user?.role}</strong>.
          </p>

          {/* Placeholder stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { label: "Total Users", value: "—" },
              { label: "Active Courses", value: "—" },
              { label: "Enrollments", value: "—" },
              { label: "Revenue", value: "—" },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: "#131313",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                  {card.label}
                </p>
                <p style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
