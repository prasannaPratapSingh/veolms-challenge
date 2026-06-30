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
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{
        background: "#0B0F14",
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
          bottom: "-5rem",
          right: "-3rem",
          fontFamily: "'Helvetica', Arial, sans-serif",
          fontSize: "clamp(10rem, 22vw, 20rem)",
          fontWeight: 900,
          color: "rgba(157, 180, 198,0.025)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}
      >
        04
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ marginBottom: "4.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ display: "block", width: "20px", height: "1px", background: "#9DB4C6" }} />
            <span
              style={{
                color: "#9DB4C6",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              What learners say
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Helvetica', Arial, sans-serif",
              color: "#F5F8FA",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.05,
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
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.id}
              variants={cardItem}
              whileHover={{ borderColor: "rgba(157, 180, 198,0.2)", y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "#1E2A39",
                border: "1px solid rgba(157, 180, 198,0.1)",
                borderRadius: "6px",
                padding: "2.25rem",
                margin: 0,
                position: "relative",
              }}
            >
              {/* Decorative quote mark */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "2rem",
                  fontFamily: "'Helvetica', Arial, sans-serif",
                  fontSize: "5rem",
                  lineHeight: 0.8,
                  color: "rgba(157, 180, 198,0.08)",
                  userSelect: "none",
                }}
              >
                "
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "1.25rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="#9DB4C6"
                    style={{ opacity: 0.7 }}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p
                style={{
                  color: "rgba(245, 248, 250,0.55)",
                  fontSize: "0.875rem",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                "{t.text}"
              </p>

              <footer style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(157, 180, 198,0.1)",
                    border: "1px solid rgba(157, 180, 198,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#9DB4C6",
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p
                    style={{
                      color: "#F5F8FA",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(245, 248, 250,0.3)",
                      fontSize: "0.72rem",
                      margin: "0.2rem 0 0",
                      fontWeight: 300,
                    }}
                  >
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
