import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import { useNavigate } from "react-router";
import axiosInstance from "../../../lib/authInstance";

/* ─── Types ─── */
type Tab = "overview" | "my-courses" | "progress";

interface Enrollment {
  courseId: { _id: string; title: string; thumbnail?: string; createdBy?: string; };
  createdAt: string;
}

interface ProgressRecord {
  courseId: { _id: string; title: string };
  lessonId: { _id: string; title: string };
  completed: boolean;
  completedAt?: string;
}

interface UserProfile { name: string; email: string; avatarUrl?: string; role?: string; }

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Spinner ─── */
function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "sm" ? "w-4 h-4 border-2" : "w-10 h-10 border-4";
  return <span className={`inline-block ${cls} border-white/20 border-t-white rounded-full animate-spin`} />;
}

/* ─── Icons ─── */
const OverviewIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const CoursesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const ProgressIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/* ─── SidebarButton ─── */
function SidebarButton({ active, onClick, label, icon, onClose }: {
  active: boolean; onClick: () => void; label: string; icon: React.ReactNode; onClose?: () => void;
}) {
  return (
    <button
      onClick={() => { onClick(); onClose?.(); }}
      style={active ? { background: "#9DB4C6", color: "#0B0F14", border: "1px solid #9DB4C6" } : { color: "rgba(245, 248, 250,0.45)", border: "1px solid transparent" }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold transition-all group hover:text-[#F5F8FA]`}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.06)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <span style={{ color: active ? "#0B0F14" : "rgba(157, 180, 198,0.5)" }} className="transition-colors">{icon}</span>
      {label}
    </button>
  );
}

/* ─── StatCard ─── */
function StatCard({ label, value, delay }: { label: string; value: string | number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }}
      className="rounded-sm p-5 transition-all duration-300 hover:-translate-y-1"
    >
      <p style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="text-xs font-bold uppercase mb-3">{label}</p>
      <p style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#9DB4C6" }} className="text-2xl sm:text-3xl font-extrabold tracking-tight">{value}</p>
    </motion.div>
  );
}

/* ─── CourseCard ─── */
function CourseCard({ enrollment, onViewProgress, showViewProgress }: {
  enrollment: Enrollment; onViewProgress?: () => void; showViewProgress?: boolean;
}) {
  const course = enrollment.courseId;
  const navigate = useNavigate();
  const enrolledDate = new Date(enrollment.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
  return (
    <div
      onClick={() => navigate(`/course/${course._id}/learn`)}
      style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }}
      className="group rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.25)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.1)")}
    >
      <div className="aspect-video bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-medium" style={{ color: "rgba(157, 180, 198,0.2)" }}>No Cover</div>
        )}
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="font-bold text-sm sm:text-base leading-snug mb-2 line-clamp-2">{course.title}</h3>
        {course.createdBy && <p style={{ color: "rgba(245, 248, 250,0.35)" }} className="text-xs mb-3 truncate">{course.createdBy}</p>}
        <p style={{ color: "rgba(157, 180, 198,0.35)" }} className="text-xs mt-auto">Enrolled {enrolledDate}</p>
        {showViewProgress && onViewProgress && (
          <button
            onClick={(e) => { e.stopPropagation(); onViewProgress(); }}
            style={{ border: "1px solid rgba(157, 180, 198,0.2)", color: "rgba(157, 180, 198,0.7)" }}
            className="mt-4 w-full py-2 rounded-sm text-xs font-bold transition-colors hover:bg-[rgba(157, 180, 198,0.08)]"
          >
            View Progress
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── OverviewTab ─── */
function OverviewTab({ name, enrollments, progress, onSetTab }: {
  name: string; enrollments: Enrollment[]; progress: ProgressRecord[]; onSetTab: (tab: Tab) => void;
}) {
  const completedLessons = progress.filter((p) => p.completed).length;
  const inProgressCourses = new Set(progress.filter((p) => !p.completed).map((p) => p.courseId._id)).size;
  const courseIds = [...new Set(progress.map((p) => p.courseId._id))];
  const avgCompletion = courseIds.length === 0 ? 0 : Math.round(
    courseIds.reduce((sum, id) => {
      const total = progress.filter((p) => p.courseId._id === id).length;
      const done = progress.filter((p) => p.courseId._id === id && p.completed).length;
      return sum + (total === 0 ? 0 : (done / total) * 100);
    }, 0) / courseIds.length
  );
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: EASE }}>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
          Welcome back, {name.split(" ")[0] || "Learner"}
        </h1>
        <p style={{ color: "rgba(245, 248, 250,0.4)" }} className="text-sm sm:text-base font-light">Your learning dashboard</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard label="Enrolled" value={enrollments.length} delay={0} />
        <StatCard label="Completed" value={completedLessons} delay={0.05} />
        <StatCard label="In Progress" value={inProgressCourses} delay={0.1} />
        <StatCard label="Avg %" value={`${avgCompletion}%`} delay={0.15} />
      </div>
      <div className="mb-5 flex items-center justify-between">
        <h2 style={{ color: "#F5F8FA" }} className="text-base sm:text-lg font-bold">My Enrolled Courses</h2>
        {enrollments.length > 0 && (
          <button onClick={() => onSetTab("my-courses")} style={{ color: "rgba(157, 180, 198,0.6)" }} className="text-xs transition-colors hover:text-[#9DB4C6]">View all →</button>
        )}
      </div>
      {enrollments.length === 0 ? (
        <div className="text-center py-16 sm:py-24 rounded-sm" style={{ border: "1px dashed rgba(157, 180, 198,0.12)", background: "rgba(157, 180, 198,0.02)" }}>
          <p style={{ color: "rgba(245, 248, 250,0.3)" }} className="mb-3">No courses enrolled yet.</p>
          <a href="/courses" style={{ color: "#9DB4C6" }} className="text-sm font-bold underline underline-offset-4 transition-colors">Browse courses →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {enrollments.slice(0, 6).map((enr, i) => (
            <motion.div key={enr.courseId._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}>
              <CourseCard enrollment={enr} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── MyCoursesTab ─── */
function MyCoursesTab({ enrollments, onViewProgress }: { enrollments: Enrollment[]; onViewProgress: (courseId: string) => void; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: EASE }}>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">My Courses</h1>
        <p style={{ color: "rgba(245, 248, 250,0.4)" }} className="text-sm sm:text-base font-light">All your enrolled courses</p>
      </div>
      {enrollments.length === 0 ? (
        <div className="text-center py-16 sm:py-24 rounded-sm" style={{ border: "1px dashed rgba(157, 180, 198,0.12)", background: "rgba(157, 180, 198,0.02)" }}>
          <p style={{ color: "rgba(245, 248, 250,0.3)" }} className="mb-3">No courses enrolled yet.</p>
          <a href="/courses" style={{ color: "#9DB4C6" }} className="text-sm font-bold underline underline-offset-4 transition-colors">Browse courses →</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {enrollments.map((enr, i) => (
            <motion.div key={enr.courseId._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}>
              <CourseCard enrollment={enr} showViewProgress onViewProgress={() => onViewProgress(enr.courseId._id)} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── ProgressTab ─── */
function ProgressTab({ progress, filteredCourseId }: { progress: ProgressRecord[]; filteredCourseId: string | null; }) {
  const grouped: Record<string, { title: string; records: ProgressRecord[] }> = {};
  for (const record of progress) {
    const id = record.courseId._id;
    if (!grouped[id]) grouped[id] = { title: record.courseId.title, records: [] };
    grouped[id].records.push(record);
  }
  const entries = Object.entries(grouped).filter(([id]) => filteredCourseId === null || id === filteredCourseId);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: EASE }}>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">Progress</h1>
        <p style={{ color: "rgba(245, 248, 250,0.4)" }} className="text-sm sm:text-base font-light">Track your lesson completion across all courses</p>
      </div>
      {entries.length === 0 ? (
        <div className="text-center py-16 sm:py-24 rounded-sm" style={{ border: "1px dashed rgba(157, 180, 198,0.12)", background: "rgba(157, 180, 198,0.02)" }}>
          <p style={{ color: "rgba(245, 248, 250,0.3)" }}>No progress data yet. Start learning!</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {entries.map(([courseId, { title, records }], i) => {
            const completedCount = records.filter((r) => r.completed).length;
            return (
              <motion.div key={courseId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }} className="rounded-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1" style={{ borderBottom: "1px solid rgba(157, 180, 198,0.07)" }}>
                  <h3 style={{ color: "#F5F8FA" }} className="font-bold text-sm sm:text-base line-clamp-1">{title}</h3>
                  <span style={{ color: "rgba(157, 180, 198,0.5)" }} className="text-xs font-bold shrink-0">{completedCount} / {records.length} lessons</span>
                </div>
                <ul className="divide-y" style={{ borderColor: "rgba(157, 180, 198,0.05)" }}>
                  {records.map((record) => (
                    <li key={record.lessonId._id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3" style={{ borderBottom: "1px solid rgba(157, 180, 198,0.05)" }}>
                      <div style={{ border: record.completed ? "1px solid rgba(157, 180, 198,0.3)" : "1px solid rgba(157, 180, 198,0.1)", background: record.completed ? "rgba(157, 180, 198,0.1)" : "transparent" }} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0">
                        {record.completed && <CheckIcon />}
                      </div>
                      <span style={{ color: record.completed ? "rgba(245, 248, 250,0.75)" : "rgba(245, 248, 250,0.3)" }} className="text-xs sm:text-sm font-medium flex-1 min-w-0 truncate">
                        {record.lessonId.title}
                      </span>
                      {record.completed && record.completedAt && (
                        <span style={{ color: "rgba(157, 180, 198,0.4)" }} className="ml-auto text-xs shrink-0">
                          {new Date(record.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Sidebar content (shared between desktop and mobile drawer) ─── */
function SidebarContent({ activeTab, handleSetTab, displayName, avatarUrl, initial, onLogout, onClose }: {
  activeTab: Tab; handleSetTab: (tab: Tab) => void; displayName: string;
  avatarUrl: string; initial: string; onLogout: () => void; onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex-1">

        {/* User Info */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div style={{ background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span style={{ color: "#9DB4C6" }} className="text-sm font-bold">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <p style={{ color: "#F5F8FA" }} className="text-sm font-semibold truncate">{displayName}</p>
            <span style={{ color: "rgba(157, 180, 198,0.5)", background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.12)" }} className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm mt-0.5">Learner</span>
          </div>
        </div>
        {/* Nav */}
        <nav className="space-y-1.5">
          <SidebarButton active={activeTab === "overview"} onClick={() => handleSetTab("overview")} label="Overview" icon={<OverviewIcon />} onClose={onClose} />
          <SidebarButton active={activeTab === "my-courses"} onClick={() => handleSetTab("my-courses")} label="My Courses" icon={<CoursesIcon />} onClose={onClose} />
          <SidebarButton active={activeTab === "progress"} onClick={() => handleSetTab("progress")} label="Progress" icon={<ProgressIcon />} onClose={onClose} />
        </nav>
      </div>
      {/* Sign out */}
      <div className="p-6" style={{ borderTop: "1px solid rgba(157, 180, 198,0.08)" }}>
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{ border: "1px solid rgba(157, 180, 198,0.1)", color: "rgba(245, 248, 250,0.4)" }}
          className="w-full py-2.5 rounded-sm text-sm font-semibold transition-colors flex items-center justify-center gap-2 hover:text-[#F5F8FA]"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.05)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
        >
          <LogoutIcon /> Sign out
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function UserDashboard() {
  const reduxUser = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [progressFilterCourseId, setProgressFilterCourseId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const displayName: string =
    profile?.name ?? reduxUser?.data?.name ?? reduxUser?.user?.name ?? reduxUser?.name ?? "Learner";
  const avatarUrl: string =
    profile?.avatarUrl ?? reduxUser?.data?.avatarUrl ?? reduxUser?.user?.avatarUrl ?? reduxUser?.avatarUrl ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      axiosInstance.get("/user/").catch(() => null),
      axiosInstance.get("/user/getEnrollments").catch(() => null),
      axiosInstance.get("/progress/my-progress").catch(() => null),
    ]).then(([profileRes, enrollRes, progressRes]) => {
      if (cancelled) return;
      if (profileRes?.data) {
        const d = profileRes.data;
        setProfile(d?.data ?? d?.user ?? d);
      }
      if (enrollRes?.data) {
        const raw = enrollRes.data;
        const arr: Enrollment[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
        setEnrollments(arr.filter((e) => e.courseId));
      }
      if (progressRes?.data) {
        const raw = progressRes.data;
        const arr: ProgressRecord[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
        setProgress(arr.filter((p) => p.courseId && p.lessonId));
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  const handleSetTab = (tab: Tab) => {
    if (tab !== "progress") setProgressFilterCourseId(null);
    setActiveTab(tab);
  };

  const handleViewProgress = (courseId: string) => {
    setProgressFilterCourseId(courseId);
    setActiveTab("progress");
  };

  const onLogout = async () => {
    await handleLogout();
    window.location.replace("/");
  };

  const sidebarProps = { activeTab, handleSetTab, displayName, avatarUrl, initial, onLogout };

  return (
    <div className="flex h-screen antialiased overflow-hidden pt-[68px]" style={{ background: "#0B0F14", color: "#F5F8FA" }}>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-full" style={{ background: "#1F2A39", borderRight: "1px solid rgba(157, 180, 198,0.1)" }}>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-[68px] left-0 right-0 z-40 h-12 flex items-center justify-between px-4" style={{ background: "rgba(11, 15, 20,0.97)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(157, 180, 198,0.1)" }}>
        <span className="text-sm font-semibold text-white capitalize">{activeTab.replace("-", " ")}</span>
        <button onClick={() => setMobileNavOpen(v => !v)} className="p-2 text-white/60 hover:text-white transition-colors" aria-label="Toggle navigation">
          {mobileNavOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile nav drawer ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40 top-[116px]"
              onClick={() => setMobileNavOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed left-0 top-[116px] bottom-0 w-72 z-50 overflow-y-auto" style={{ background: "#0B0F14", borderRight: "1px solid rgba(157, 180, 198,0.1)" }}
            >
              <SidebarContent {...sidebarProps} onClose={() => setMobileNavOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-12" style={{ background: "#0B0F14" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {loading ? (
            <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <OverviewTab key="overview" name={displayName} enrollments={enrollments} progress={progress} onSetTab={handleSetTab} />
              )}
              {activeTab === "my-courses" && (
                <MyCoursesTab key="my-courses" enrollments={enrollments} onViewProgress={handleViewProgress} />
              )}
              {activeTab === "progress" && (
                <ProgressTab key="progress" progress={progress} filteredCourseId={progressFilterCourseId} />
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
