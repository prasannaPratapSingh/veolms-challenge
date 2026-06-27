import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

const AVATAR_LETTERS = ["A", "B", "C", "D", "E"];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "8rem 1.5rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "860px" }}>
        {/* Badge */}
        <motion.span
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)",
            color: "rgba(255,255,255,0.65)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.35rem 1rem",
            borderRadius: "100px",
            marginBottom: "1.8rem",
          }}
        >
          500+ Courses · Expert Instructors · Lifetime Access
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            marginBottom: "1.5rem",
          }}
        >
          Learn skills that
          <br />
          <span style={{ color: "#fff" }}>
            move careers forward.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "520px",
            margin: "0 auto 2.8rem",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          On-demand courses built by practitioners not slideshow lecturers.
          Go from zero to job-ready at your own pace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.03, opacity: 0.92 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#fff",
              color: "#000",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Start Learning Free →
          </motion.a>
          <motion.a
            href="#courses"
            whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
              fontSize: "0.95rem",
              padding: "0.85rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "inline-block",
            }}
          >
            Browse Courses
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
          style={{
            marginTop: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex" }}>
            {AVATAR_LETTERS.map((l, i) => (
              <div
                key={l}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: `hsl(0, 0%, ${20 + i * 8}%)`,
                  border: "2px solid #0a0a0a",
                  marginLeft: i === 0 ? 0 : "-9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
            Joined by{" "}
            <strong style={{ color: "rgba(255,255,255,0.8)" }}>48,000+</strong>{" "}
            learners this year
          </span>
        </motion.div>
      </div>
    </section>
  );
}
