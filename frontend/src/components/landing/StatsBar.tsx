import { motion, type Variants } from "framer-motion";

const STATS = [
  { value: "500+", label: "Courses" },
  { value: "120+", label: "Expert Instructors" },
  { value: "48k+", label: "Active Learners" },
  { value: "94%", label: "Completion Rate" },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function StatsBar() {
  return (
    <section
      style={{
        background: "#161510",
        borderTop: "1px solid rgba(200,169,110,0.1)",
        borderBottom: "1px solid rgba(200,169,110,0.1)",
        padding: "0 2rem",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            variants={item}
            style={{
              padding: "2.5rem 1rem",
              textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(200,169,110,0.08)" : "none",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 800,
                color: "#c8a96e",
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                color: "rgba(237,232,223,0.35)",
                fontSize: "0.68rem",
                fontWeight: 600,
                marginTop: "0.5rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0.5rem 0 0",
              }}
            >
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
