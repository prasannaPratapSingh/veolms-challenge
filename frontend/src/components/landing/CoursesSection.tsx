import { motion, type Variants } from "framer-motion";
import { Link } from "react-router";
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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function CoursesSection() {
  const { fetchCourses } = useCourse();
  const coursesData = useSelector((state: any) => state?.course?.courses);
  const loading = useSelector((state: any) => state?.course?.loading);

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      style={{ background: "#0B0F14", padding: "8rem 1.5rem", position: "relative", overflow: "hidden" }}
    >
      {/* Decorative large watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-5rem",
          left: "-3rem",
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
        02
      </div>

      <style>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .courses-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative" }}>
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
            marginBottom: "3.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.6rem",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "1px",
                  background: "#9DB4C6",
                }}
              />
              <span
                style={{
                  color: "#9DB4C6",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                What we offer
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Helvetica', Arial, sans-serif",
                color: "#F5F8FA",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Featured Courses
            </h2>
          </div>
          <Link
            to="/courses"
            style={{
              color: "rgba(157, 180, 198,0.6)",
              fontSize: "0.8rem",
              fontWeight: 500,
              textDecoration: "none",
              borderBottom: "1px solid rgba(157, 180, 198,0.2)",
              paddingBottom: "2px",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#9DB4C6";
              (e.currentTarget as HTMLElement).style.borderBottomColor = "#9DB4C6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(157, 180, 198,0.6)";
              (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(157, 180, 198,0.2)";
            }}
          >
            View all courses →
          </Link>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="courses-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#1F2A39",
                  border: "1px solid rgba(157, 180, 198,0.08)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  height: "400px",
                }}
              >
                <div
                  style={{
                    height: "190px",
                    background: "rgba(157, 180, 198,0.04)",
                    animation: "pulse 1.8s ease-in-out infinite",
                  }}
                />
                <div style={{ padding: "1.4rem 1.5rem" }}>
                  <div
                    style={{
                      height: "18px",
                      background: "rgba(157, 180, 198,0.06)",
                      borderRadius: "3px",
                      marginBottom: "0.8rem",
                      width: "75%",
                    }}
                  />
                  <div style={{ height: "12px", background: "rgba(157, 180, 198,0.04)", borderRadius: "3px", marginBottom: "0.5rem", width: "100%" }} />
                  <div style={{ height: "12px", background: "rgba(157, 180, 198,0.04)", borderRadius: "3px", width: "55%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : coursesData.length === 0 ? (
          <p
            style={{
              color: "rgba(245, 248, 250,0.25)",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 300,
            }}
          >
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
