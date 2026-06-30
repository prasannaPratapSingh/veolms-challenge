import { motion } from "framer-motion";
import { useNavigate } from "react-router";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  createdBy: string;
  isPublished: boolean;
  createdAt: string;
}

interface Props {
  course: Course;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function CourseCard({ course }: Props) {
  const navigate = useNavigate();

  return (
    <motion.article
      onClick={() => navigate(`/course/${course._id}`)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        background: "#1E2A39",
        border: "1px solid rgba(157, 180, 198,0.1)",
        borderRadius: "6px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "190px",
          background: "#1E2A39",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
            }
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(157, 180, 198,0.15)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            No Image
          </div>
        )}

        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(11, 15, 20,0.4) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {course.isPublished && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "#9DB4C6",
              color: "#0B0F14",
              fontSize: "0.58rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "2px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Live
          </span>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "1.4rem 1.5rem 1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily: "'Helvetica', Arial, sans-serif",
            color: "#F5F8FA",
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: "0.6rem",
            letterSpacing: "-0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            color: "rgba(245, 248, 250,0.35)",
            fontSize: "0.78rem",
            lineHeight: 1.65,
            marginBottom: "1.25rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 300,
          }}
        >
          {course.description}
        </p>

        {/* Instructor */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span
            style={{
              display: "block",
              color: "rgba(157, 180, 198,0.5)",
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "0.3rem",
            }}
          >
            Educator
          </span>
          <p
            style={{
              color: "rgba(245, 248, 250,0.5)",
              fontSize: "0.78rem",
              fontWeight: 400,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {course.createdBy}
          </p>
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(157, 180, 198,0.08)",
            marginBottom: "1.25rem",
          }}
        />

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                color: "rgba(157, 180, 198,0.5)",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.15rem",
              }}
            >
              Price
            </span>
            <span
              style={{
                fontFamily: "'Helvetica', Arial, sans-serif",
                color: "#F5F8FA",
                fontSize: "1.25rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              ₹{course.price}
            </span>
          </div>

          <motion.button
            whileHover={{
              background: "#9DB4C6",
              color: "#0B0F14",
              borderColor: "#9DB4C6",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "transparent",
              color: "rgba(157, 180, 198,0.8)",
              border: "1px solid rgba(157, 180, 198,0.25)",
              borderRadius: "3px",
              padding: "0.5rem 1.1rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.04em",
              fontFamily: "'Helvetica', Arial, sans-serif",
            }}
          >
            Enrol Now
          </motion.button>
        </div>

        <p
          style={{
            color: "rgba(245, 248, 250,0.18)",
            fontSize: "0.65rem",
            marginTop: "0.9rem",
            letterSpacing: "0.04em",
            fontWeight: 300,
          }}
        >
          Added {formatDate(course.createdAt)}
        </p>
      </div>
    </motion.article>
  );
}
