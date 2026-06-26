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
  transition: { duration: 0.55, ease: EASE, delay },
});

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  color: "#fff",
  fontSize: "0.92rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const inputErrorStyle: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(239,68,68,0.6)",
};

export default function AdminLogin() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<loginBody>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: loginBody) => {
    try {
      const result = await handleLogin(data);

      // The hook sets the user in Redux; check the returned data for role.
      // result is the API response — adjust the key to match your backend shape.
      const role = result?.user?.role ?? result?.role;

      if (role !== "ADMIN") {
        // Not an admin — set a visible form-level error and stay on page.
        setError("root", {
          message: "Access denied. This portal is for administrators only.",
        });
        return;
      }

      navigate("/admin/veodashboard", { replace: true });
    } catch {
      // hook already toasted the API error
    }
  };

  const isBusy = isSubmitting || loading;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        {...fadeUp(0)}
        style={{ position: "relative", width: "100%", maxWidth: "420px" }}
      >
        <div
          style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "2.5rem 2rem",
          }}
        >
          {/* Header */}
          <motion.div {...fadeUp(0.05)} style={{ marginBottom: "2rem" }}>
            <Link
              to="/"
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#fff",
                textDecoration: "none",
                letterSpacing: "-0.03em",
                display: "inline-block",
                marginBottom: "1.5rem",
              }}
            >
              veo<span style={{ opacity: 0.35 }}>lms</span>
            </Link>

            {/* Admin badge */}
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "100px",
                }}
              >
                Admin Portal
              </span>
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 0.4rem",
              }}
            >
              Administrator sign in
            </h1>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.875rem", margin: 0 }}>
              Restricted access. Authorised personnel only.
            </p>
          </motion.div>

          {/* Root-level (role) error */}
          {errors.root && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                color: "rgb(239,68,68)",
                fontSize: "0.82rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{errors.root.message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="admin-email" style={labelStyle}>
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@veolms.com"
                autoComplete="email"
                className="auth-input"
                style={errors.email ? inputErrorStyle : inputBase}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && <FieldError message={errors.email.message} />}
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.15)} style={{ marginBottom: "1.6rem" }}>
              <label htmlFor="admin-password" style={labelStyle}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="auth-input"
                style={errors.password ? inputErrorStyle : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password && <FieldError message={errors.password.message} />}
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.2)}>
              <motion.button
                type="submit"
                disabled={isBusy}
                whileHover={!isBusy ? { opacity: 0.88 } : {}}
                whileTap={!isBusy ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  background: isBusy ? "rgba(255,255,255,0.35)" : "#fff",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  padding: "0.8rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isBusy ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "inherit",
                }}
              >
                {isBusy ? <><Spinner /> Signing in…</> : "Sign in as Admin"}
              </motion.button>
            </motion.div>
          </form>

          {/* Back to main site */}
          <motion.p
            {...fadeUp(0.25)}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.28)",
              fontSize: "0.8rem",
              marginTop: "1.5rem",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "rgba(255,255,255,0.38)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "1px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)")
              }
            >
              ← Back to learner sign in
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        color: "rgb(239,68,68)",
        fontSize: "0.76rem",
        marginTop: "0.35rem",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      <span>⚠</span> {message}
    </motion.p>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: "14px",
        height: "14px",
        border: "2px solid rgba(0,0,0,0.25)",
        borderTopColor: "#000",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  letterSpacing: "0.01em",
};
