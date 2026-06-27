import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import type { registerBody } from "../../../types/auth.type";

/* ── animation helpers ── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
});

/* ── styles ── */
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

/* ── form type (adds confirmPassword on top of registerBody) ── */
interface SignUpFormValues extends registerBody {
  confirmPassword: string;
}

export default function SignUp() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await handleRegister({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/login");
    } catch {
      // error already dispatched + toasted by the hook
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
      {/* Subtle grid background */}
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
        style={{ position: "relative", width: "100%", maxWidth: "440px" }}
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
          {/* Brand + header */}
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
              Create your account
            </h1>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.875rem", margin: 0 }}>
              Start learning today. Free to join.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full name */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="name" style={labelStyle}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Alex Morgan"
                autoComplete="name"
                className="auth-input"
                style={errors.name ? inputErrorStyle : inputBase}
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name is too long" },
                })}
              />
              <FieldError message={errors.name?.message} />
            </motion.div>

            {/* Email */}
            <motion.div {...fadeUp(0.13)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
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
              <FieldError message={errors.email?.message} />
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.16)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className="auth-input"
                style={errors.password ? inputErrorStyle : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                    message: "Password must include at least one letter and one number",
                  },
                })}
              />
              <FieldError message={errors.password?.message} />
            </motion.div>

            {/* Confirm password */}
            <motion.div {...fadeUp(0.19)} style={{ marginBottom: "1.6rem" }}>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="auth-input"
                style={errors.confirmPassword ? inputErrorStyle : inputBase}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === passwordValue || "Passwords do not match",
                })}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.22)}>
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
                {isBusy ? (
                  <>
                    <Spinner /> Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Terms note */}
          <motion.p
            {...fadeUp(0.26)}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.24)",
              fontSize: "0.73rem",
              marginTop: "1.2rem",
              lineHeight: 1.55,
            }}
          >
            By signing up you agree to our{" "}
            <a href="#" style={tinyLinkStyle}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" style={tinyLinkStyle}>Privacy Policy</a>.
          </motion.p>

          {/* Divider */}
          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Login link */}
          <motion.p
            {...fadeUp(0.3)}
            style={{ textAlign: "center", color: "rgba(255,255,255,0.38)", fontSize: "0.85rem", margin: 0 }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
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
              Sign in →
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── shared micro-components ── */
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

/* ── style constants ── */
const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.8rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  letterSpacing: "0.01em",
};

const tinyLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};