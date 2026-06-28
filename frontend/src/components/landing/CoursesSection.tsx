import { motion, type Variants } from "framer-motion";
import CourseCard from "./CourseCard";
import { useCourse } from "../../features/course/hook/course.hook";
import { useEffect } from "react";
import { useSelector } from "react-redux";



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

  const { fetchCourses } = useCourse();

  const coursesData = useSelector((state: any) => state?.course?.courses);
  const loading = useSelector((state: any) => state?.course?.loading);

  useEffect(() => {
    fetchCourses();
  }, [])

  return (
    <section
      id="courses"
      style={{ background: "#0a0a0a", padding: "7rem 1.5rem" }}
    >
      {/* Responsive grid breakpoints */}
      <style>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>
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
        {loading ? (
          /* Skeleton cards while loading */
          <div className="courses-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  height: "380px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              >
                <div style={{ height: "180px", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ padding: "1.25rem 1.4rem" }}>
                  <div style={{ height: "16px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", marginBottom: "0.75rem", width: "80%" }} />
                  <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", marginBottom: "0.5rem", width: "100%" }} />
                  <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : coursesData.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.9rem" }}>
            No courses available yet.
          </p>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="courses-grid"
          >
            {coursesData.map((c: any) => (
              <motion.div key={c._id} variants={cardVariants} style={{ height: "100%" }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
