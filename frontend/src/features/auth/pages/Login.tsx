import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import type { loginBody } from "../../../types/auth.type";

/* ── animation ── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
});

/* ── shared input style ── */
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

const inputError: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(239,68,68,0.6)",
};

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginBody>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: loginBody) => {
    try {
      await handleLogin(data);
      navigate("/", { replace: true });
    } catch {
      // error already dispatched + toasted by the hook — nothing extra needed
    }
  };

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
          "'Bricolage Grotesque', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Subtle grid */}
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
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "2.5rem 2rem",
          }}
        >
          {/* Logo */}
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
              LearnSphere
            </Link>

            <h1
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 0.4rem",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              Sign in to continue learning.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                  letterSpacing: "0.01em",
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="auth-input"
                style={errors.email ? inputError : inputBase}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
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
                  <span>⚠</span> {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.15)} style={{ marginBottom: "1.6rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.4rem",
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.38)")
                  }
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="auth-input"
                style={errors.password ? inputError : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
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
                  <span>⚠</span> {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.2)}>
              <motion.button
                type="submit"
                disabled={isSubmitting || loading}
                whileHover={!(isSubmitting || loading) ? { opacity: 0.88 } : {}}
                whileTap={!(isSubmitting || loading) ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  background: isSubmitting || loading ? "rgba(255,255,255,0.35)" : "#fff",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  padding: "0.8rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting || loading ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "inherit",
                }}
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Spinner /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            {...fadeUp(0.25)}
            style={{
              margin: "1.8rem 0",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.75rem" }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </motion.div>

          {/* Sign up link */}
          <motion.p
            {...fadeUp(0.3)}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.38)",
              fontSize: "0.85rem",
              margin: 0,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.25)",
                paddingBottom: "1px",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
              }}
            >
              Create one →
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Inline spinner ── */
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