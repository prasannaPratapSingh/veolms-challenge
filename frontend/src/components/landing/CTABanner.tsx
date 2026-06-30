import { motion } from "framer-motion";
import { Link } from "react-router";
import Threads from "../Threads";

export default function CTABanner() {
  return (
    <section
      style={{
        background: "#9DB4C6",
        padding: "7rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Threads Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.3, zIndex: 0 }}>
        <Threads
          color={[0, 0, 0]}
          amplitude={1}
          distance={0}
          enableMouseInteraction
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Fine dot texture on accent background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(11, 15, 20,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Ambient warm center glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(255,245,220,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        <h2
          style={{
            fontFamily: "'Helvetica', Arial, sans-serif",
            color: "#0B0F14",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: "1.25rem",
          }}
        >
          Your next chapter
          <br />
          <em style={{ fontStyle: "italic" }}>starts today.</em>
        </h2>
        <p
          style={{
            color: "rgba(11, 15, 20,0.6)",
            fontSize: "1rem",
            lineHeight: 1.75,
            marginBottom: "2.75rem",
            fontWeight: 300,
          }}
        >
          Join 48,000 learners who chose LearnSphere to upskill faster.
          No subscription. Pay once, learn forever.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.a
            href="/signup"
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#0B0F14",
              color: "#9DB4C6",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
              padding: "0.9rem 2.4rem",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block",
              fontFamily: "'Helvetica', Arial, sans-serif",
            }}
          >
            Create Free Account →
          </motion.a>
          <motion.div
            whileHover={{ opacity: 0.85, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Link
              to="/courses"
              style={{
                background: "transparent",
                color: "#0B0F14",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
                padding: "0.9rem 2.4rem",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block",
                border: "2px solid rgba(11, 15, 20,0.2)",
              }}
            >
              Browse Courses
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
