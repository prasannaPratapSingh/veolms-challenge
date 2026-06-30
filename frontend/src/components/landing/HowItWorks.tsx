import { motion, type Variants } from "framer-motion";
import { STEPS } from "./data";

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const stepsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const stepItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#161510",
        borderTop: "1px solid rgba(200,169,110,0.08)",
        borderBottom: "1px solid rgba(200,169,110,0.08)",
        padding: "8rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-5rem",
          right: "-3rem",
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
        03
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ display: "block", width: "20px", height: "1px", background: "#c8a96e" }} />
            <span
              style={{
                color: "#c8a96e",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              The Process
            </span>
            <span style={{ display: "block", width: "20px", height: "1px", background: "#c8a96e" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#ede8df",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.05,
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
            gap: "0",
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              variants={stepItem}
              whileHover={{ background: "rgba(200,169,110,0.03)" }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "2.5rem 2.5rem",
                borderRight: i < STEPS.length - 1 ? "1px solid rgba(200,169,110,0.08)" : "none",
                borderTop: "1px solid rgba(200,169,110,0.08)",
                position: "relative",
              }}
            >
              {/* Large editorial step number */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "5rem",
                  fontWeight: 900,
                  color: "rgba(200,169,110,0.1)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  marginBottom: "1.5rem",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  color: "#ede8df",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "rgba(237,232,223,0.4)",
                  fontSize: "0.85rem",
                  lineHeight: 1.75,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {step.desc}
              </p>

              {/* Bottom accent line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "2.5rem",
                  width: "32px",
                  height: "2px",
                  background: "rgba(200,169,110,0.3)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
