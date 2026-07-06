import { motion } from "framer-motion";
import Grainient from "../Grainient";
import { useMediaQuery } from "../../lib/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "#0B0F14",
        fontFamily: "'Helvetica', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "7rem 1.5rem 7rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grainient Background — desktop only */}
      {isDesktop && (
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none', zIndex: 0 }}>
          <Grainient
            color1="#0B0F14"
            color2="#1E2A39"
            color3="#9DB4C6"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>
      )}

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
            "radial-gradient(ellipse at center, rgba(253,197,0,0.15) 0%, transparent 70%)",
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
            "radial-gradient(rgba(253,197,0,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%)",
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
              background: "rgba(253,197,0,0.5)",
            }}
          />
          <span
            style={{
              color: "#9DB4C6",
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
              background: "rgba(253,197,0,0.5)",
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
            fontFamily: "'Helvetica', Arial, sans-serif",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 800,
            color: "#F5F8FA",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: "1.8rem",
          }}
        >
          Learn skills that
          <br />
          <p className="text-[#9DB4C6]">
            move careers forward.
          </p>
        
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.22}
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "rgba(245, 248, 250,0.5)",
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
            whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(253,197,0,0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#9DB4C6",
              color: "#0B0F14",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              padding: "0.9rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block",
              fontFamily: "'Helvetica', Arial, sans-serif",
            }}
          >
            Start Learning Free →
          </motion.a>
          <motion.a
            href="#courses"
            whileHover={{ borderColor: "rgba(253,197,0,0.6)", color: "#F5F8FA" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: "rgba(245, 248, 250,0.55)",
              fontWeight: 500,
              fontSize: "0.9rem",
              padding: "0.9rem 2.2rem",
              borderRadius: "4px",
              textDecoration: "none",
              border: "1px solid rgba(245, 248, 250,0.12)",
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
                  background: ["#0B0F14", "#1E2A39", "#5C7386", "#9DB4C6", "#D6DEE6", "#F5F8FA"][i],
                  border: "2px solid #0B0F14",
                  marginLeft: i === 0 ? 0 : "-8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#9DB4C6",
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <span style={{ color: "rgba(245, 248, 250,0.38)", fontSize: "0.82rem", fontWeight: 300 }}>
            Joined by{" "}
            <strong style={{ color: "#9DB4C6", fontWeight: 600 }}>48,000+</strong>{" "}
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
          fontFamily: "'Helvetica', Arial, sans-serif",
          fontSize: "clamp(10rem, 22vw, 20rem)",
          fontWeight: 900,
          color: "rgba(253,197,0,0.05)",
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
