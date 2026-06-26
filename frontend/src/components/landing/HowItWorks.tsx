import { motion, type Variants } from "framer-motion";
import { STEPS } from "./data";

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const stepsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const stepItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#111",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "7rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            The Process
          </span>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Simple as 1 — 2 — 3
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={stepsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={stepItem}
              whileHover={{ borderColor: "rgba(255,255,255,0.14)", y: -3 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "2rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0a0a0a",
              }}
            >
              <span
                style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.05)",
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "1rem",
                  letterSpacing: "-0.04em",
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "0.6rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.42)",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
