import { motion } from "framer-motion";
import type { Course } from "./data";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <motion.article
      whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.18)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        background: "#131313",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "152px",
          background: `hsl(0, 0%, ${13 + course.id * 3}%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          {course.emoji}
        </div>

        {course.tag && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#fff",
              color: "#000",
              fontSize: "0.66rem",
              fontWeight: 700,
              padding: "0.18rem 0.55rem",
              borderRadius: "4px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {course.tag}
          </span>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "1.2rem 1.3rem 1.3rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          {course.level}
        </p>

        <h3
          style={{
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: "0.4rem",
            letterSpacing: "-0.01em",
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "0.78rem",
            marginBottom: "1rem",
          }}
        >
          by {course.instructor}
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            marginBottom: "1.2rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "⏱", val: course.duration },
            { icon: "▶", val: `${course.lessons} lessons` },
            { icon: "👥", val: `${course.students}` },
          ].map((m) => (
            <span
              key={m.val}
              style={{
                color: "rgba(255,255,255,0.32)",
                fontSize: "0.72rem",
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
              }}
            >
              <span>{m.icon}</span>
              <span>{m.val}</span>
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            ${course.price}
          </span>
          <motion.button
            whileHover={{ background: "#fff", color: "#000" }}
            transition={{ duration: 0.18 }}
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.7)",
              border: "none",
              borderRadius: "6px",
              padding: "0.48rem 1rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enrol Now
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
