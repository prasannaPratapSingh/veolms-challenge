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
  background: "rgba(200,169,110,0.04)",
  border: "1px solid rgba(200,169,110,0.15)",
  borderRadius: "4px",
  padding: "0.75rem 1rem",
  color: "#ede8df",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};
const inputError: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(224,112,112,0.5)",
};

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<loginBody>({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data: loginBody) => {
    try {
      await handleLogin(data);
      navigate("/", { replace: true });
    } catch { /* toasted by hook */ }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0d0b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      {/* Dot texture */}
      <div aria-hidden style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(rgba(200,169,110,0.05) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {/* Warm glow */}
      <div aria-hidden style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(200,169,110,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div {...fadeUp(0)} style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        {/* Card */}
        <div style={{
          background: "#161510",
          border: "1px solid rgba(200,169,110,0.12)",
          borderRadius: "6px",
          padding: "2.5rem 2.25rem",
        }}>
          {/* Logo */}
          <motion.div {...fadeUp(0.05)} style={{ marginBottom: "2.25rem" }}>
            <Link to="/" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem", fontWeight: 800,
              color: "#ede8df", textDecoration: "none",
              letterSpacing: "-0.02em", display: "inline-block",
              marginBottom: "1.75rem",
            }}>
              LearnSphere
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <span style={{ display: "block", width: "16px", height: "1px", background: "#c8a96e" }} />
              <span style={{ color: "#c8a96e", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Learner Access
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#ede8df", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.4rem" }}>
              Welcome back
            </h1>
            <p style={{ color: "rgba(237,232,223,0.4)", fontSize: "0.85rem", margin: 0, fontWeight: 300 }}>
              Sign in to continue learning.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="email" style={labelStyle}>Email address</label>
              <input id="email" type="email" placeholder="you@example.com" autoComplete="email"
                className="auth-input" style={errors.email ? inputError : inputBase}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })} />
              <FieldError message={errors.email?.message} />
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.15)} style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <a href="#" style={{ color: "rgba(200,169,110,0.45)", fontSize: "0.73rem", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#c8a96e")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "rgba(200,169,110,0.45)")}>
                  Forgot password?
                </a>
              </div>
              <input id="password" type="password" placeholder="••••••••" autoComplete="current-password"
                className="auth-input" style={errors.password ? inputError : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })} />
              <FieldError message={errors.password?.message} />
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.2)}>
              <motion.button type="submit" disabled={isSubmitting || loading}
                whileHover={!(isSubmitting || loading) ? { boxShadow: "0 0 24px rgba(200,169,110,0.2)" } : {}}
                whileTap={!(isSubmitting || loading) ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  background: (isSubmitting || loading) ? "rgba(200,169,110,0.3)" : "#c8a96e",
                  color: "#0e0d0b", fontWeight: 700, fontSize: "0.88rem",
                  padding: "0.85rem", border: "none", borderRadius: "4px",
                  cursor: (isSubmitting || loading) ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em", transition: "background 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {(isSubmitting || loading) ? <><Spinner /> Signing in…</> : "Sign in →"}
              </motion.button>
            </motion.div>
          </form>

          <Divider />

          {/* Sign up link */}
          <motion.p {...fadeUp(0.3)} style={{ textAlign: "center", color: "rgba(237,232,223,0.35)", fontSize: "0.83rem", margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{
              color: "#c8a96e", fontWeight: 600, textDecoration: "none",
              borderBottom: "1px solid rgba(200,169,110,0.3)", paddingBottom: "1px",
              transition: "color 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#c8a96e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(200,169,110,0.3)"; }}>
              Create one →
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function Spinner() {
  return <span style={{ width: "14px", height: "14px", border: "2px solid rgba(14,13,11,0.25)", borderTopColor: "#0e0d0b", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />;
}
function Divider() {
  return (
    <div style={{ margin: "1.75rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(200,169,110,0.08)" }} />
      <span style={{ color: "rgba(200,169,110,0.3)", fontSize: "0.72rem" }}>or</span>
      <div style={{ flex: 1, height: "1px", background: "rgba(200,169,110,0.08)" }} />
    </div>
  );
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
  display: "block", color: "rgba(237,232,223,0.5)", fontSize: "0.75rem",
  fontWeight: 600, marginBottom: "0.4rem", letterSpacing: "0.04em",
};
