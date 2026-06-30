import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

const AVATAR_LETTERS = ["A", "B", "C", "D", "E"];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "#0e0d0b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "9rem 1.5rem 7rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient warm glow top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(200,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Fine dot texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(200,169,110,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Thin horizontal rule accent */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.05 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "5%",
          right: "5%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(200,169,110,0.12), transparent)",
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "900px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2.2rem",
          }}
        >
          <span
            style={{
              display: "block",
              width: "28px",
              height: "1px",
              background: "rgba(200,169,110,0.5)",
            }}
          />
          <span
            style={{
              color: "#c8a96e",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            500+ Courses · Expert Instructors · Lifetime Access
          </span>
          <span
            style={{
              display: "block",
              width: "28px",
              height: "1px",
              background: "rgba(200,169,110,0.5)",
            }}
          />
        </motion.div>

        {/* Headline — editorial serif */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 800,
            color: "#ede8df",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: "1.8rem",
          }}
        >
          Learn skills that
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "#c8a96e",
            }}
          >
            move careers forward.
          </em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.22}
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "rgba(237,232,223,0.5)",
            maxWidth: "500px",
            margin: "0 auto 3rem",
            lineHeight: 1.75,
            fontWeight: 300,
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
          custom={0.34}
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(200,169,110,0.22)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#c8a96e",
              color: "#0e0d0b",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              padding: "0.9rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Start Learning Free →
          </motion.a>
          <motion.a
            href="#courses"
            whileHover={{ borderColor: "rgba(200,169,110,0.4)", color: "#ede8df" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: "rgba(237,232,223,0.55)",
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "0.9rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              border: "1px solid rgba(237,232,223,0.12)",
              display: "inline-block",
              transition: "border-color 0.2s, color 0.2s",
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
          custom={0.5}
          style={{
            marginTop: "4.5rem",
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
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: `hsl(38, ${18 + i * 5}%, ${20 + i * 5}%)`,
                  border: "2px solid #0e0d0b",
                  marginLeft: i === 0 ? 0 : "-8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#c8a96e",
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <span style={{ color: "rgba(237,232,223,0.38)", fontSize: "0.82rem", fontWeight: 300 }}>
            Joined by{" "}
            <strong style={{ color: "#c8a96e", fontWeight: 600 }}>48,000+</strong>{" "}
            learners this year
          </span>
        </motion.div>
      </div>

      {/* Decorative large editorial number watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-4rem",
          right: "-2rem",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(10rem, 22vw, 20rem)",
          fontWeight: 900,
          color: "rgba(200,169,110,0.025)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}
      >
        01
      </motion.div>
    </section>
  );
}
