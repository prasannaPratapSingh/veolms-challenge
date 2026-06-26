import { motion, type Variants } from "framer-motion";
import { TESTIMONIALS } from "./data";

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const cardsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{ background: "#0a0a0a", padding: "7rem 1.5rem" }}
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
            What learners say
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
            Results speak louder.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={cardsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.blockquote
              key={t.id}
              variants={cardItem}
              whileHover={{ borderColor: "rgba(255,255,255,0.13)", y: -3 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "2rem",
                margin: 0,
              }}
            >
              {/* Stars */}
              <div style={{ marginBottom: "1.1rem" }}>
                {"★★★★★".split("").map((s, i) => (
                  <span
                    key={i}
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", marginRight: "1px" }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  marginBottom: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                "{t.text}"
              </p>

              <footer style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem", margin: 0, lineHeight: 1.2 }}>
                    {t.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.73rem", margin: "0.15rem 0 0" }}>
                    {t.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
