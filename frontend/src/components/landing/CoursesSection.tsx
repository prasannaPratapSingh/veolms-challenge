import { motion, type Variants } from "framer-motion";
import { COURSES } from "./data";
import CourseCard from "./CourseCard";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function CoursesSection() {
  return (
    <section
      id="courses"
      style={{ background: "#0a0a0a", padding: "7rem 1.5rem" }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              What we offer
            </span>
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Featured Courses
            </h2>
          </div>
          <a
            href="#courses"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.18)",
              paddingBottom: "2px",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#fff")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")
            }
          >
            View all courses →
          </a>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {COURSES.map((c) => (
            <motion.div key={c.id} variants={cardVariants}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
