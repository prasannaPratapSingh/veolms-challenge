import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import type { registerBody } from "../../../types/auth.type";

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

interface SignUpFormValues extends registerBody { confirmPassword: string; }

export default function SignUp() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const loading = useSelector((state: any) => state.auth.loading);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<SignUpFormValues>({ defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });

  const passwordValue = watch("password");
  const isBusy = isSubmitting || loading;

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await handleRegister({ name: data.name, email: data.email, password: data.password });
      navigate("/login");
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

      <motion.div {...fadeUp(0)} style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <span style={{ display: "block", width: "16px", height: "1px", background: "#9DB4C6" }} />
              <span style={{ color: "#9DB4C6", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                New Account
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F5F8FA", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.4rem" }}>
              Create your account
            </h1>
            <p style={{ color: "rgba(245, 248, 250,0.4)", fontSize: "0.85rem", margin: 0, fontWeight: 300 }}>
              Start learning today. Free to join.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="name" style={labelStyle}>Full name</label>
              <input id="name" type="text" placeholder="Alex Morgan" autoComplete="name"
                className="auth-input" style={errors.name ? inputErrorStyle : inputBase}
                {...register("name", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name is too long" },
                })} />
              <FieldError message={errors.name?.message} />
            </motion.div>

            <motion.div {...fadeUp(0.13)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="email" style={labelStyle}>Email address</label>
              <input id="email" type="email" placeholder="you@example.com" autoComplete="email"
                className="auth-input" style={errors.email ? inputErrorStyle : inputBase}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                })} />
              <FieldError message={errors.email?.message} />
            </motion.div>

            <motion.div {...fadeUp(0.16)} style={{ marginBottom: "1.1rem" }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input id="password" type="password" placeholder="Min. 6 characters" autoComplete="new-password"
                className="auth-input" style={errors.password ? inputErrorStyle : inputBase}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: "Must include at least one letter and one number" },
                })} />
              <FieldError message={errors.password?.message} />
            </motion.div>

            <motion.div {...fadeUp(0.19)} style={{ marginBottom: "1.75rem" }}>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm password</label>
              <input id="confirmPassword" type="password" placeholder="Repeat your password" autoComplete="new-password"
                className="auth-input" style={errors.confirmPassword ? inputErrorStyle : inputBase}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === passwordValue || "Passwords do not match",
                })} />
              <FieldError message={errors.confirmPassword?.message} />
            </motion.div>

            <motion.div {...fadeUp(0.22)}>
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
                {isBusy ? <><Spinner /> Creating account…</> : "Create account →"}
              </motion.button>
            </motion.div>
          </form>

          <motion.p {...fadeUp(0.26)} style={{
            textAlign: "center", color: "rgba(245, 248, 250,0.22)",
            fontSize: "0.7rem", marginTop: "1.1rem", lineHeight: 1.6,
          }}>
            By signing up you agree to our{" "}
            <a href="#" style={tinyLinkStyle}>Terms</a> and{" "}
            <a href="#" style={tinyLinkStyle}>Privacy Policy</a>.
          </motion.p>

          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(157, 180, 198,0.08)" }} />
            <span style={{ color: "rgba(157, 180, 198,0.3)", fontSize: "0.72rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(157, 180, 198,0.08)" }} />
          </div>

          <motion.p {...fadeUp(0.3)} style={{ textAlign: "center", color: "rgba(245, 248, 250,0.35)", fontSize: "0.83rem", margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "#9DB4C6", fontWeight: 600, textDecoration: "none",
              borderBottom: "1px solid rgba(157, 180, 198,0.3)", paddingBottom: "1px",
            }}>Sign in →</Link>
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
const tinyLinkStyle: React.CSSProperties = {
  color: "rgba(157, 180, 198,0.45)", textDecoration: "underline", textUnderlineOffset: "2px",
};
