import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/auth.hook";
import { useNavigate } from "react-router";
import axiosInstance from "../../../lib/authInstance";

/* ─── Types ─── */
type Tab = "overview" | "my-courses" | "progress";

interface Enrollment {
  courseId: {
    _id: string;
    title: string;
    thumbnail?: string;
    createdBy?: string;
  };
  createdAt: string;
}

interface ProgressRecord {
  courseId: { _id: string; title: string };
  lessonId: { _id: string; title: string };
  completed: boolean;
  completedAt?: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Spinner ─── */
function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "sm" ? "w-4 h-4 border-2" : "w-10 h-10 border-4";
  return (
    <span
      className={`inline-block ${cls} border-white/20 border-t-white rounded-full animate-spin`}
    />
  );
}

/* ─── SidebarButton ─── */
function SidebarButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
        active
          ? "bg-white text-black shadow-lg"
          : "text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent"
      }`}
    >
      <span
        className={`${
          active ? "text-black" : "text-white/30 group-hover:text-white/60"
        } transition-colors`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
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

/* ─── StatCard ─── */
function StatCard({
  label,
  value,
  delay,
}: {
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
    >
      <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase mb-4">
        {label}
      </p>
      <p className="text-white text-3xl font-extrabold tracking-tighter">{value}</p>
    </motion.div>
  );
}

/* ─── CourseCard ─── */
function CourseCard({
  enrollment,
  onViewProgress,
  showViewProgress,
}: {
  enrollment: Enrollment;
  onViewProgress?: () => void;
  showViewProgress?: boolean;
}) {
  const course = enrollment.courseId;
  const navigate = useNavigate();
  const enrolledDate = new Date(enrollment.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/course/${course._id}/learn`)}
      className="group bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
    >
      <div className="aspect-video bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-medium">
            No Cover
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 text-white">
          {course.title}
        </h3>
        {course.createdBy && (
          <p className="text-neutral-500 text-xs mb-3 truncate">{course.createdBy}</p>
        )}
        <p className="text-neutral-600 text-xs mt-auto">Enrolled {enrolledDate}</p>
        {showViewProgress && onViewProgress && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProgress();
            }}
            className="mt-4 w-full py-2 rounded-xl border border-white/10 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            View Progress
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── OverviewTab ─── */
function OverviewTab({
  name,
  enrollments,
  progress,
  onSetTab,
}: {
  name: string;
  enrollments: Enrollment[];
  progress: ProgressRecord[];
  onSetTab: (tab: Tab) => void;
}) {
  const completedLessons = progress.filter((p) => p.completed).length;
  const inProgressCourses = new Set(
    progress.filter((p) => !p.completed).map((p) => p.courseId._id)
  ).size;
  const courseIds = [...new Set(progress.map((p) => p.courseId._id))];
  const avgCompletion =
    courseIds.length === 0
      ? 0
      : Math.round(
          courseIds.reduce((sum, id) => {
            const total = progress.filter((p) => p.courseId._id === id).length;
            const done = progress.filter((p) => p.courseId._id === id && p.completed).length;
            return sum + (total === 0 ? 0 : (done / total) * 100);
          }, 0) / courseIds.length
        );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Welcome back, {name.split(" ")[0] || "Learner"}
        </h1>
        <p className="text-neutral-400 text-base">Your learning dashboard</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        <StatCard label="Courses Enrolled" value={enrollments.length} delay={0} />
        <StatCard label="Completed Lessons" value={completedLessons} delay={0.05} />
        <StatCard label="In-Progress Courses" value={inProgressCourses} delay={0.1} />
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} delay={0.15} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">My Enrolled Courses</h2>
        {enrollments.length > 0 && (
          <button
            onClick={() => onSetTab("my-courses")}
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            View all →
          </button>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-neutral-500 mb-3">No courses enrolled yet.</p>
          <a
            href="/courses"
            className="text-sm font-bold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
          >
            Browse courses →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.slice(0, 6).map((enr, i) => (
            <motion.div
              key={enr.courseId._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            >
              <CourseCard enrollment={enr} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── MyCoursesTab ─── */
function MyCoursesTab({
  enrollments,
  onViewProgress,
}: {
  enrollments: Enrollment[];
  onViewProgress: (courseId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">My Courses</h1>
        <p className="text-neutral-400 text-base">All your enrolled courses</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-neutral-500 mb-3">No courses enrolled yet.</p>
          <a
            href="/courses"
            className="text-sm font-bold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
          >
            Browse courses →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.map((enr, i) => (
            <motion.div
              key={enr.courseId._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            >
              <CourseCard
                enrollment={enr}
                showViewProgress
                onViewProgress={() => onViewProgress(enr.courseId._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── ProgressTab ─── */
function ProgressTab({
  progress,
  filteredCourseId,
}: {
  progress: ProgressRecord[];
  filteredCourseId: string | null;
}) {
  // Group by course
  const grouped: Record<string, { title: string; records: ProgressRecord[] }> = {};
  for (const record of progress) {
    const id = record.courseId._id;
    if (!grouped[id]) {
      grouped[id] = { title: record.courseId.title, records: [] };
    }
    grouped[id].records.push(record);
  }

  const entries = Object.entries(grouped).filter(
    ([id]) => filteredCourseId === null || id === filteredCourseId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Progress</h1>
        <p className="text-neutral-400 text-base">Track your lesson completion across all courses</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-neutral-500">No progress data yet. Start learning!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map(([courseId, { title, records }], i) => {
            const completedCount = records.filter((r) => r.completed).length;
            return (
              <motion.div
                key={courseId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-white text-base line-clamp-1">{title}</h3>
                  <span className="text-xs font-bold text-neutral-400 shrink-0 ml-4">
                    {completedCount} / {records.length} lessons completed
                  </span>
                </div>
                <ul className="divide-y divide-white/[0.03]">
                  {records.map((record) => (
                    <li
                      key={record.lessonId._id}
                      className="flex items-center gap-4 px-6 py-3"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                          record.completed
                            ? "bg-white/10 border-white/20"
                            : "border-white/10 bg-transparent"
                        }`}
                      >
                        {record.completed && <CheckIcon />}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          record.completed ? "text-white/80" : "text-neutral-500"
                        }`}
                      >
                        {record.lessonId.title}
                      </span>
                      {record.completed && record.completedAt && (
                        <span className="ml-auto text-xs text-neutral-600 shrink-0">
                          {new Date(record.completedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
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

/* ─── Main Component ─── */
export default function UserDashboard() {
  const reduxUser = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [progressFilterCourseId, setProgressFilterCourseId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Resolve display name from various possible user shapes
  const displayName: string =
    profile?.name ??
    reduxUser?.data?.name ??
    reduxUser?.user?.name ??
    reduxUser?.name ??
    "Learner";

  const avatarUrl: string =
    profile?.avatarUrl ??
    reduxUser?.data?.avatarUrl ??
    reduxUser?.user?.avatarUrl ??
    reduxUser?.avatarUrl ??
    "";

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
        const arr: Enrollment[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setEnrollments(arr.filter((e) => e.courseId));
      }
      if (progressRes?.data) {
        const raw = progressRes.data;
        const arr: ProgressRecord[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setProgress(arr.filter((p) => p.courseId && p.lessonId));
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleViewProgress = (courseId: string) => {
    setProgressFilterCourseId(courseId);
    setActiveTab("progress");
  };

  const handleSetTab = (tab: Tab) => {
    if (tab !== "progress") setProgressFilterCourseId(null);
    setActiveTab(tab);
  };

  const onLogout = async () => {
    await handleLogout();
    window.location.replace("/");
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans antialiased overflow-hidden pt-[68px]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 bg-white/[0.02] flex flex-col justify-between h-full">
        <div className="p-6">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-lg">
              <span className="font-bold text-black text-xs">L</span>
            </div>
            <span className="font-extrabold text-lg tracking-tighter">LearnSphere</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white/70">{initial}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white/40 bg-white/5 px-2 py-0.5 rounded-full mt-0.5">
                Learner
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            <SidebarButton
              active={activeTab === "overview"}
              onClick={() => handleSetTab("overview")}
              label="Overview"
              icon={<OverviewIcon />}
            />
            <SidebarButton
              active={activeTab === "my-courses"}
              onClick={() => handleSetTab("my-courses")}
              label="My Courses"
              icon={<CoursesIcon />}
            />
            <SidebarButton
              active={activeTab === "progress"}
              onClick={() => handleSetTab("progress")}
              label="Progress"
              icon={<ProgressIcon />}
            />
          </nav>
        </div>

        {/* Sign out */}
        <div className="p-6 border-t border-white/5">
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl border border-white/5 text-sm font-semibold text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <LogoutIcon />
            Sign out
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <OverviewTab
                  key="overview"
                  name={displayName}
                  enrollments={enrollments}
                  progress={progress}
                  onSetTab={handleSetTab}
                />
              )}
              {activeTab === "my-courses" && (
                <MyCoursesTab
                  key="my-courses"
                  enrollments={enrollments}
                  onViewProgress={handleViewProgress}
                />
              )}
              {activeTab === "progress" && (
                <ProgressTab
                  key="progress"
                  progress={progress}
                  filteredCourseId={progressFilterCourseId}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
