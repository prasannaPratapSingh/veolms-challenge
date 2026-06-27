import { motion } from "framer-motion";

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
  return (
    <motion.article
      whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.16)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",  // fill grid row
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "180px",
          background: "#1a1a1a",
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
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")
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
              color: "rgba(255,255,255,0.12)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            NO IMAGE
          </div>
        )}

        {/* Published badge */}
        {course.isPublished && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#fff",
              color: "#000",
              fontSize: "0.62rem",
              fontWeight: 700,
              padding: "0.2rem 0.55rem",
              borderRadius: "4px",
              letterSpacing: "0.07em",
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
          padding: "1.25rem 1.4rem 1.4rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Title */}
        <h3
          style={{
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "0.8rem",
            lineHeight: 1.6,
            marginBottom: "1.1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.description}
        </p>

        {/* Instructor row */}
        <div style={{ marginBottom: "1.1rem" }}>
          <span
            style={{
              display: "block",
              color: "rgba(255,255,255,0.28)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.35rem",
            }}
          >
            Educator
          </span>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.76rem",
              fontWeight: 500,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {course.createdBy}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
            marginBottom: "1.1rem",
          }}
        />

        {/* Footer — price + CTA */}
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
                color: "rgba(255,255,255,0.28)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.1rem",
              }}
            >
              Price
            </span>
            <span
              style={{
                color: "#fff",
                fontSize: "1.15rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              ₹{course.price}
            </span>
          </div>

          <motion.button
            whileHover={{ background: "#fff", color: "#000" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16 }}
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "7px",
              padding: "0.5rem 1.1rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            Enrol Now
          </motion.button>
        </div>

        {/* Added date */}
        <p
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.68rem",
            marginTop: "0.85rem",
            letterSpacing: "0.02em",
          }}
        >
          Added {formatDate(course.createdAt)}
        </p>
      </div>
    </motion.article>
  );
}
