import { motion } from "framer-motion";
import { Link } from "react-router";

export default function CTABanner() {
  return (
    <section
      style={{ background: "#fff", padding: "7rem 1.5rem", textAlign: "center" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: "680px", margin: "0 auto" }}
      >
        <h2
          style={{
            color: "#000",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: "1.2rem",
          }}
        >
          Your next chapter starts today.
        </h2>
        <p
          style={{
            color: "rgba(0,0,0,0.52)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            marginBottom: "2.4rem",
          }}
        >
          Join 48,000 learners who chose LearnSphere to upskill faster.
          No subscription. Pay once, learn forever.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a
            href="/signup"
            whileHover={{ opacity: 0.86, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#000",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "0.9rem 2.4rem",
              borderRadius: "8px",
              textDecoration: "none",
              display: "inline-block",
              letterSpacing: "-0.01em",
            }}
          >
            Create Free Account →
          </motion.a>
          <motion.div
            whileHover={{ opacity: 0.86, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Link
              to="/courses"
              style={{
                background: "transparent",
                color: "#000",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.9rem 2.4rem",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "-0.01em",
                border: "2px solid rgba(0,0,0,0.15)",
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
