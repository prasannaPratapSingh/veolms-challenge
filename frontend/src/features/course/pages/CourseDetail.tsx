import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../lib/authInstance";

/* ─── Types ─── */
interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isPreview: boolean;
  order: number;
  videoUrl?: string;
}

interface Section {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isPublished: boolean;
  sections: Section[];
}

/* ─── Helpers ─── */
function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function totalLessons(sections: Section[]): number {
  return sections.reduce((sum, s) => sum + s.lessons.length, 0);
}

function totalDuration(sections: Section[]): string {
  const secs = sections
    .flatMap((s) => s.lessons)
    .reduce((sum, l) => sum + (l.duration || 0), 0);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* ─── Spinner ─── */
function Spinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <span className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  );
}

/* ─── SectionAccordion ─── */
function SectionAccordion({
  section,
  isEnrolled,
  courseId,
}: {
  section: Section;
  isEnrolled: boolean;
  courseId: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ border: "1px solid rgba(200,169,110,0.1)", borderRadius: "4px", overflow: "hidden" }}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: "#161510" }}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors text-left"
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(200,169,110,0.04)")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#161510")}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "rgba(200,169,110,0.3)" }} className="text-xs font-bold w-5 text-right shrink-0">
            {section.order + 1}
          </span>
          <span style={{ color: "#ede8df" }} className="font-semibold text-sm">{section.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span style={{ color: "rgba(200,169,110,0.4)" }} className="text-xs">
            {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            style={{ color: "rgba(200,169,110,0.4)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Lessons */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="divide-y" style={{ borderColor: "rgba(200,169,110,0.05)" }}>
              {section.lessons.map((lesson) => {
                const accessible = isEnrolled || lesson.isPreview;

                const rowContent = (
                  <li
                    key={lesson._id}
                    style={{ background: "#0e0d0b", borderBottom: "1px solid rgba(200,169,110,0.05)" }}
                    className={`flex items-center gap-4 px-5 py-3 transition-colors group ${accessible ? "cursor-pointer" : ""}`}
                    onMouseEnter={e => { if (accessible) (e.currentTarget as HTMLElement).style.background = "rgba(200,169,110,0.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0e0d0b"; }}
                  >
                    {/* Play / lock icon */}
                    <div style={{ border: "1px solid rgba(200,169,110,0.12)" }} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                      {accessible ? (
                        <svg className="w-3 h-3" style={{ color: "#c8a96e" }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" style={{ color: "rgba(200,169,110,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p style={{ color: accessible ? "rgba(237,232,223,0.75)" : "rgba(237,232,223,0.3)" }} className="text-sm font-medium truncate">
                        {lesson.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {!isEnrolled && lesson.isPreview && (
                        <span style={{ color: "#c8a96e", background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.15)" }} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          Preview
                        </span>
                      )}
                      <span style={{ color: "rgba(200,169,110,0.35)" }} className="text-xs">
                        {formatDuration(lesson.duration)}
                      </span>
                    </div>
                  </li>
                );

                // Enrolled users click any lesson → go to /learn (no page reload via Link)
                if (isEnrolled) {
                  return (
                    <Link
                      key={lesson._id}
                      to={`/course/${courseId}/learn`}
                      className="block no-underline"
                    >
                      {rowContent}
                    </Link>
                  );
                }

                return rowContent;
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─── */
export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    const fetchCourse = axiosInstance
      .get(`/course/getCourse/${courseId}`)
      .then((res) => {
        const d = res.data;
        setCourse(d?.data ?? d);
      })
      .catch(() => setNotFound(true));

    const fetchEnrollment = axiosInstance
      .get(`/enrollment/course/${courseId}`)
      .then(() => setIsEnrolled(true))
      .catch(() => setIsEnrolled(false)); // 404 or 401 = not enrolled, ignore

    Promise.all([fetchCourse, fetchEnrollment]).finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0e0d0b" }}>
      <span className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(200,169,110,0.15)", borderTopColor: "#c8a96e" }} />
    </div>
  );

  if (notFound || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0e0d0b" }}>
        <p style={{ color: "rgba(237,232,223,0.4)" }} className="text-lg">Course not found.</p>
        <Link to="/" style={{ color: "#c8a96e" }} className="text-sm underline underline-offset-4">← Back to home</Link>
      </div>
    );
  }

  const lessons = totalLessons(course.sections);
  const duration = totalDuration(course.sections);
  const previewCount = course.sections
    .flatMap((s) => s.lessons)
    .filter((l) => l.isPreview).length;

  return (
    <div className="min-h-screen pt-[68px]" style={{ background: "#0e0d0b", color: "#ede8df" }}>
      {/* Hero */}
      <div style={{ background: "#161510", borderBottom: "1px solid rgba(200,169,110,0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-[#ede8df] transition-colors mb-6 no-underline"
              style={{ color: "rgba(200,169,110,0.5)" }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Courses
            </Link>

            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#ede8df" }} className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              {course.title}
            </h1>

            <p style={{ color: "rgba(237,232,223,0.48)" }} className="text-base leading-relaxed mb-8 max-w-2xl font-light">
              {course.description}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: "▶", label: `${lessons} lessons` },
                { icon: "⏱", label: duration },
                { icon: "👁", label: `${previewCount} free previews` },
                { icon: "📚", label: `${course.sections.length} sections` },
              ].map((m) => (
                <span
                  key={m.label}
                  className="flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-medium"
                  style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.12)", color: "rgba(237,232,223,0.5)" }}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif", color: "#ede8df" }} className="text-3xl font-extrabold tracking-tight">₹{course.price}</span>
              </div>
              {isEnrolled ? (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(200,169,110,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/course/${courseId}/learn`)}
                  style={{ background: "#c8a96e", color: "#0e0d0b" }}
                  className="font-bold text-sm px-6 py-3 rounded-sm cursor-pointer border-0"
                >
                  Continue Learning →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(200,169,110,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/course/${courseId}/checkout`)}
                  style={{ background: "#c8a96e", color: "#0e0d0b" }}
                  className="font-bold text-sm px-6 py-3 rounded-sm cursor-pointer border-0"
                >
                  Enrol Now
                </motion.button>
              )}
              <Link
                to="/"
                style={{ color: "rgba(200,169,110,0.5)" }}
                className="text-sm font-medium hover:text-[#c8a96e] transition-colors no-underline"
              >
                Browse more →
              </Link>
            </div>
          </motion.div>

          {/* Right: thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full lg:w-80 xl:w-96 shrink-0"
          >
            <div className="rounded-sm overflow-hidden aspect-video" style={{ border: "1px solid rgba(200,169,110,0.12)", background: "#1d1b16" }}>
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "rgba(200,169,110,0.2)" }}>No Cover</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ color: "#ede8df" }} className="text-xl font-bold tracking-tight">Course Curriculum</h2>
            <span style={{ color: "rgba(200,169,110,0.45)" }} className="text-sm">
              {course.sections.length} sections · {lessons} lessons · {duration} total
            </span>
          </div>

          {course.sections.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-2xl">
              <p className="text-white/25 text-sm">No curriculum added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.sections.map((section) => (
                <SectionAccordion
                  key={section._id}
                  section={section}
                  isEnrolled={isEnrolled}
                  courseId={courseId!}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
