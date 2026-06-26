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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function StatsBar() {
  return (
    <section
      style={{
        background: "#111",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "2.8rem 2rem",
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
          gap: "1rem",
          textAlign: "center",
        }}
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={item}>
            <p
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.04em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginTop: "0.3rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
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
