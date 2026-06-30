import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import type { loginBody } from "../../../types/auth.type";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(157, 180, 198,0.04)",
  border: "1px solid rgba(157, 180, 198,0.15)",
  borderRadius: "4px",
  padding: "0.75rem 1rem",
  color: "#F5F8FA",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};
const inputErrorStyle: React.CSSProperties = { ...inputBase, border: "1px solid rgba(224,112,112,0.5)" };

export default function AdminLogin() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<loginBody>({ defaultValues: { email: "", password: "" } });

  const isBusy = isSubmitting || loading;

  const onSubmit = async (data: loginBody) => {
    try {
      const result = await handleLogin(data);
      const role = result?.user?.role ?? result?.role;
      if (role !== "ADMIN") {
        setError("root", { message: "Access denied. This portal is for administrators only." });
        return;
      }
      navigate("/admin/veodashboard", { replace: true });
    } catch { /* toasted */ }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0B0F14",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      <div aria-hidden style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(rgba(157, 180, 198,0.05) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(157, 180, 198,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div {...fadeUp(0)} style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        <div style={{
          background: "#1E2A39", border: "1px solid rgba(157, 180, 198,0.12)",
          borderRadius: "6px", padding: "2.5rem 2.25rem",
        }}>
          <motion.div {...fadeUp(0.05)} style={{ marginBottom: "2.25rem" }}>
            <Link to="/" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem", fontWeight: 800, color: "#F5F8FA",
              textDecoration: "none", letterSpacing: "-0.02em",
              display: "inline-block", marginBottom: "1.75rem",
            }}>LearnSphere</Link>

            {/* Admin badge */}
            <div style={{ marginBottom: "1rem" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.2)",
                color: "#9DB4C6", fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.25rem 0.8rem", borderRadius: "2px",
              }}>
                <span style={{ display: "block", width: "5px", height: "5px", borderRadius: "50%", background: "#9DB4C6" }} />
                Admin Portal
              </span>
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F5F8FA", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.4rem" }}>
              Administrator sign in
            </h1>
            <p style={{ color: "rgba(245, 248, 250,0.4)", fontSize: "0.85rem", margin: 0, fontWeight: 300 }}>
              Restricted access. Authorised personnel only.
            </p>
          </motion.div>

          {/* Root error */}
          {errors.root && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{
              background: "rgba(224,112,112,0.06)", border: "1px solid rgba(224,112,112,0.25)",
              borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1.25rem",
              color: "#e07070", fontSize: "0.8rem", display: "flex", gap: "0.5rem", alignItems: "flex-start",
            }}>
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{errors.root.message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="admin-email" style={labelStyle}>Email address</label>
              <input id="admin-email" type="email" placeholder="admin@learnsphere.com" autoComplete="email"
                className="auth-input" style={errors.email ? inputErrorStyle : inputBase}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })} />
              {errors.email && <FieldError message={errors.email.message} />}
            </motion.div>

            <motion.div {...fadeUp(0.15)} style={{ marginBottom: "1.75rem" }}>
              <label htmlFor="admin-password" style={labelStyle}>Password</label>
              <input id="admin-password" type="password" placeholder="••••••••" autoComplete="current-password"
                className="auth-input" style={errors.password ? inputErrorStyle : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })} />
              {errors.password && <FieldError message={errors.password.message} />}
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <motion.button type="submit" disabled={isBusy}
                whileHover={!isBusy ? { boxShadow: "0 0 24px rgba(157, 180, 198,0.2)" } : {}}
                whileTap={!isBusy ? { scale: 0.98 } : {}}
                style={{
                  width: "100%", background: isBusy ? "rgba(157, 180, 198,0.3)" : "#9DB4C6",
                  color: "#0B0F14", fontWeight: 700, fontSize: "0.88rem",
                  padding: "0.85rem", border: "none", borderRadius: "4px",
                  cursor: isBusy ? "not-allowed" : "pointer", letterSpacing: "0.02em",
                  transition: "background 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {isBusy ? <><Spinner /> Signing in…</> : "Sign in as Admin →"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p {...fadeUp(0.25)} style={{ textAlign: "center", color: "rgba(245, 248, 250,0.25)", fontSize: "0.78rem", marginTop: "1.5rem" }}>
            <Link to="/login" style={{
              color: "rgba(157, 180, 198,0.45)", textDecoration: "none",
              borderBottom: "1px solid rgba(157, 180, 198,0.15)", paddingBottom: "1px",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#9DB4C6")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(157, 180, 198,0.45)")}>
              ← Back to learner sign in
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function Spinner() {
  return <span style={{ width: "14px", height: "14px", border: "2px solid rgba(11, 15, 20,0.25)", borderTopColor: "#0B0F14", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />;
}
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      style={{ color: "#e07070", fontSize: "0.73rem", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
      <span>⚠</span> {message}
    </motion.p>
  );
}
const labelStyle: React.CSSProperties = {
  display: "block", color: "rgba(245, 248, 250,0.5)", fontSize: "0.75rem",
  fontWeight: 600, marginBottom: "0.4rem", letterSpacing: "0.04em",
};
