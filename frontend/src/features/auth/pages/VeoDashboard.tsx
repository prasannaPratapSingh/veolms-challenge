import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/auth.hook";
import { useCourse } from "../../course/hook/course.hook";
import StudentsTab from "../components/StudentsTab";

const EASE = [0.22, 1, 0.36, 1] as const;

type Tab = "overview" | "courses" | "upload" | "students";

interface UploadCourseForm {
  title: string;
  createdBy: string;
  description: string;
  price: number;
  thumbnail: FileList;
}

export default function VeoDashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();
  const { fetchCoursesAdmin, handleUploadCourse, handlePublishToggle, handleUpdateCourse, handleGetAnalytics } = useCourse();

  useEffect(() => {
    handleGetAnalytics()
  }, [])

  // Read courses from the Redux store (the hook normalises this to an array)
  const courses = useSelector((state: any) => state.course.courses);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const onLogout = async () => {
    await handleLogout();
    window.location.replace("/admin");
  };

  return (
    <div className="flex h-screen antialiased overflow-hidden relative" style={{ background: "#0B0F14", color: "#F5F8FA" }}>

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(157, 180, 198,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-35 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col justify-between shrink-0 transition-transform duration-300 transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderRight: "1px solid rgba(157, 180, 198,0.1)", background: "#1F2A39" }}
      >
        <div className="p-8 relative">
          {/* Brand */}
          <div className="mb-12 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA", fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                LearnSphere
              </span>
              <span style={{ color: "#9DB4C6", background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.2)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em" }} className="uppercase px-2 py-0.5 rounded-sm ml-1">
                Admin
              </span>
            </div>
            
            {/* Toggle Button inside Sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-[rgba(245, 248, 250,0.5)] hover:text-[#F5F8FA] hover:bg-white/5 rounded-md transition-colors"
              title="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <SidebarButton
              active={activeTab === "overview"}
              onClick={() => handleTabClick("overview")}
              label="Overview"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
            />
            <SidebarButton
              active={activeTab === "courses"}
              onClick={() => handleTabClick("courses")}
              label="Course Library"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
            <SidebarButton
              active={activeTab === "upload"}
              onClick={() => handleTabClick("upload")}
              label="Publish Course"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
            />
            <SidebarButton
              active={activeTab === "students"}
              onClick={() => handleTabClick("students")}
              label="Students"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-6" style={{ borderTop: "1px solid rgba(157, 180, 198,0.08)", background: "rgba(157, 180, 198,0.01)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <img src={user?.data?.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="overflow-hidden">
              <p style={{ color: "#F5F8FA" }} className="text-sm font-semibold truncate">{user?.data?.name || 'Administrator'}</p>
              <p style={{ color: "rgba(157, 180, 198,0.4)" }} className="text-xs truncate">{user?.data?.email}</p>
            </div>
          </div>
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ border: "1px solid rgba(157, 180, 198,0.1)", color: "rgba(245, 248, 250,0.4)" }}
            className="w-full py-2.5 mb-2 rounded-sm text-sm font-semibold transition-colors flex items-center justify-center gap-2 hover:text-[#F5F8FA]"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.05)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Home
          </motion.button>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ border: "1px solid rgba(157, 180, 198,0.1)", color: "rgba(245, 248, 250,0.4)" }}
            className="w-full py-2.5 rounded-sm text-sm font-semibold transition-colors flex items-center justify-center gap-2 hover:text-[#F5F8FA]"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.05)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`relative z-10 flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "md:pl-72" : "md:pl-0"}`}>
        {/* Floating toggle button when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-30 p-2 bg-[#1F2A39] text-[rgba(245, 248, 250,0.6)] hover:text-[#F5F8FA] hover:bg-white/5 rounded-md border border-[rgba(157, 180, 198,0.15)] transition-colors shadow-lg"
            title="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="max-w-7xl mx-auto p-10 lg:p-14">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab key="overview" user={user} />}
            {activeTab === "courses" && <CoursesTab key="courses" courses={courses} fetchCourses={fetchCoursesAdmin} handlePublishToggle={handlePublishToggle} handleUpdateCourse={handleUpdateCourse} navigate={navigate} />}
            {activeTab === "upload" && <UploadTab key="upload" onSuccess={(courseId) => navigate(`/admin/course/${courseId}`)} handleUploadCourse={handleUploadCourse} />}
            {activeTab === "students" && <StudentsTab key="students" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ── UI Components ── */

function SidebarButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={active
        ? { background: "#9DB4C6", color: "#0B0F14", border: "1px solid #9DB4C6" }
        : { color: "rgba(245, 248, 250,0.45)", border: "1px solid transparent" }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold transition-all group"
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.06)"; (e.currentTarget as HTMLElement).style.color = "#F5F8FA"; } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.45)"; } }}
    >
      <span style={{ color: active ? "#0B0F14" : "rgba(157, 180, 198,0.45)" }} className="transition-colors">{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <div className="mb-10">
      {badge && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <span style={{ display: "block", width: "16px", height: "1px", background: "#9DB4C6" }} />
          <span style={{ color: "#9DB4C6", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>{badge}</span>
        </div>
      )}
      <h1 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
        {title}
      </h1>
      <p style={{ color: "rgba(245, 248, 250,0.4)" }} className="text-base max-w-2xl font-light">{subtitle}</p>
    </div>
  );
}

/* ── Tabs ── */

function OverviewTab({ user }: { user: any }) {
  const analytics = useSelector(
    (state: any) => state.course.analytics)
    
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <SectionHeader
        badge="Dashboard"
        title={`Welcome back, ${user?.data?.name.split(' ')[0] ?? "Admin"}`}
        subtitle="Here's a high-level overview of your platform's performance and recent activities."
      />

      <div className="flex flex-col sm:flex-row justify-around gap-2">
        {[
          { label: "Total Learners", value: `${analytics?.users}` },
          { label: "Active Courses", value: `${analytics?.courses}` },
          { label: "Total Enrollments", value: `${analytics?.enrollments}` },
          { label: "Total Earnings", value: analytics?.totalEarnings != null ? `₹${Number(analytics.totalEarnings).toLocaleString("en-IN")}` : "₹0" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }}
            className="group rounded-sm p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.22)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.1)")}
          >
            <div className="relative z-10">
              <p style={{ color: "rgba(157, 180, 198,0.55)", letterSpacing: "0.12em" }} className="text-xs font-bold uppercase mb-4">
                {card.label}
              </p>
              <p style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#9DB4C6" }} className=" text-2xl sm:text-3xl font-extrabold tracking-tight">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CoursesTab({
  courses,
  fetchCourses,
  handlePublishToggle,
  handleUpdateCourse,
  navigate
}: {
  courses: any;
  fetchCourses: () => Promise<any>;
  handlePublishToggle: (courseId: string, status: boolean) => Promise<any>;
  handleUpdateCourse: (courseId: string, data: FormData) => Promise<any>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchCourses().finally(() => setIsLoading(false));
  }, [fetchCourses]);

  const safeCourses: any[] = Array.isArray(courses)
    ? courses
    : Array.isArray(courses?.data)
      ? courses.data
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <SectionHeader
          badge="Library"
          title="Manage Courses"
          subtitle="View, edit, and monitor the performance of your published content."
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      ) : safeCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {safeCourses.map((course: any, i: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              key={course._id}
              style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }}
              className="group rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.25)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.1)")}
            >
              <div className="aspect-[16/9] bg-neutral-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium" style={{ color: "rgba(157, 180, 198,0.2)" }}>No Cover Image</div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="font-extrabold text-xl leading-tight mb-2 line-clamp-1">{course.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.15)" }} className="w-5 h-5 rounded-full flex items-center justify-center">
                    <span style={{ color: "#9DB4C6" }} className="text-[10px] font-bold">{course.createdBy?.charAt(0).toUpperCase()}</span>
                  </div>
                  <p style={{ color: "rgba(245, 248, 250,0.4)" }} className="text-xs font-medium truncate">{course.createdBy}</p>
                </div>
                <p style={{ color: "rgba(245, 248, 250,0.35)" }} className="text-sm line-clamp-2 mb-6 flex-1 leading-relaxed font-light">{course.description}</p>
                <div className="flex items-center justify-between pt-5 mt-auto" style={{ borderTop: "1px solid rgba(157, 180, 198,0.08)" }}>
                  <div className="flex flex-col">
                    <span style={{ color: "rgba(157, 180, 198,0.45)", letterSpacing: "0.1em" }} className="text-[10px] font-bold uppercase mb-0.5">Price</span>
                    <span style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="font-extrabold text-sm">₹{course.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingCourse(course); }}
                      style={{ color: "rgba(157, 180, 198,0.45)" }}
                      className="text-sm font-bold transition-colors hover:text-[#9DB4C6] flex items-center gap-1 px-2 py-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePublishToggle(course._id, course.isPublished); }}
                      style={course.isPublished
                        ? { background: "#dc2626", color: "#fff", border: "1px solid #dc2626" }
                        : { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" }}
                      className="text-xs font-bold px-3 py-1.5 rounded-sm transition-all hover:opacity-85 active:scale-95 flex items-center gap-1.5"
                    >
                      {course.isPublished ? (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          Unpublish
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Publish
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/course/${course._id}`); }}
                      style={{ background: "rgba(157, 180, 198,0.1)", color: "#9DB4C6", border: "1px solid rgba(157, 180, 198,0.2)" }}
                      className="text-sm font-bold transition-colors flex items-center gap-1 px-3 py-1.5 rounded-sm hover:bg-[rgba(157,180,198,0.18)]"
                    >
                      Curriculum
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 rounded-sm" style={{ border: "1px dashed rgba(157, 180, 198,0.12)", background: "rgba(157, 180, 198,0.01)" }}>
          <div style={{ background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.15)" }} className="w-16 h-16 mx-auto rounded-sm flex items-center justify-center mb-6">
            <svg className="w-8 h-8" style={{ color: "rgba(157, 180, 198,0.4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 style={{ color: "#F5F8FA" }} className="text-xl font-bold mb-2">No Courses Found</h3>
          <p style={{ color: "rgba(245, 248, 250,0.35)" }} className="max-w-sm mx-auto mb-8 font-light">You haven't published any courses yet. Get started by creating your first course.</p>
          <button style={{ background: "#9DB4C6", color: "#0B0F14" }} onClick={() => document.getElementById('upload-tab-btn')?.click()} className="px-6 py-3 font-bold rounded-sm transition-colors hover:opacity-90">
            Create Course
          </button>
        </div>
      )}

      {/* Edit Course Modal */}
      <AnimatePresence>
        {editingCourse && (
          <EditCourseModal
            course={editingCourse}
            onClose={() => setEditingCourse(null)}
            handleUpdateCourse={handleUpdateCourse}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UploadTab({ onSuccess, handleUploadCourse }: { onSuccess: (courseId: string) => void, handleUploadCourse: (data: FormData) => Promise<any> }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadCourseForm>();

  const onSubmit = async (data: UploadCourseForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("createdBy", data.createdBy);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const response = await handleUploadCourse(formData);
      reset();
      onSuccess(response.data._id);
    } catch {
      // Error is handled in the hook via toast
    }
  };

  const inputClass = "w-full rounded-sm px-5 py-4 text-sm focus:outline-none transition-all placeholder:text-[rgba(245, 248, 250,0.2)] auth-input" ;
  const errorClass = "w-full rounded-sm px-5 py-4 text-sm focus:outline-none transition-all placeholder:text-[rgba(245, 248, 250,0.2)]";
  const labelClass = "block text-xs font-bold uppercase tracking-widest mb-3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="max-w-3xl"
    >
      <SectionHeader
        badge="Creation"
        title="Publish Course"
        subtitle="Provide the details for your new course to make it available to learners."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8 lg:p-10 rounded-sm relative overflow-hidden" style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.12)" }}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="md:col-span-2 relative z-10">
            <label htmlFor="title" className={labelClass}>Course Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Advanced System Design Masterclass"
              className={errors.title ? errorClass : inputClass}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-400 text-xs mt-2 font-medium">{errors.title.message}</p>}
          </div>

          {/* Educator / Created By */}
          <div className="relative z-10">
            <label htmlFor="createdBy" className={labelClass}>Educator Name</label>
            <input
              id="createdBy"
              type="text"
              placeholder="e.g. Alex Morgan"
              className={errors.createdBy ? errorClass : inputClass}
              {...register("createdBy", { required: "Educator name is required" })}
            />
            {errors.createdBy && <p className="text-red-400 text-xs mt-2 font-medium">{errors.createdBy.message}</p>}
          </div>

          {/* Price */}
          <div className="relative z-10">
            <label htmlFor="price" className={labelClass}>Price (₹)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`${errors.price ? errorClass : inputClass} pl-9`}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" }
                })}
              />
            </div>
            {errors.price && <p className="text-red-400 text-xs mt-2 font-medium">{errors.price.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="relative z-10">
          <label htmlFor="description" className={labelClass}>Course Description</label>
          <textarea
            id="description"
            rows={5}
            placeholder="Explain what the students will learn, the prerequisites, and the core curriculum..."
            className={`${errors.description ? errorClass : inputClass} resize-none`}
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-400 text-xs mt-2 font-medium">{errors.description.message}</p>}
        </div>

        {/* Thumbnail */}
        <div className="relative z-10">
          <label htmlFor="thumbnail" className={labelClass}>Cover Image</label>
          <div className="relative group">
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className={`w-full file:mr-5 file:py-3 file:px-5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors ${inputClass} py-2.5 px-3`}
              {...register("thumbnail", { required: "Thumbnail is required" })}
            />
          </div>
          <p className="text-neutral-500 text-xs mt-3">High resolution image (16:9 ratio recommended). Max size 5MB.</p>
          {errors.thumbnail && <p className="text-red-400 text-xs mt-2 font-medium">{errors.thumbnail.message}</p>}
        </div>

        {/* Submit */}
        <div className="pt-8 mt-8 border-t border-white/5 relative z-10">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.01 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${isSubmitting
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-white text-black shadow-black/20 hover:bg-neutral-100 hover:opacity-90"
              }`}
          >
            {isSubmitting ? (
              <><Spinner /> Processing Upload...</>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Publish Course
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sizeClass = size === "sm" ? "w-4 h-4 border-2" : "w-10 h-10 border-4";
  return (
    <span
      className={`inline-block ${sizeClass} border-white/20 border-t-white rounded-full animate-[spin_0.7s_linear_infinite]`}
    />
  );
}

function EditCourseModal({ course, onClose, handleUpdateCourse }: { course: any; onClose: () => void; handleUpdateCourse: (courseId: string, data: FormData) => Promise<any> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UploadCourseForm>({
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
      createdBy: course.createdBy,
    }
  });

  const onSubmit = async (data: UploadCourseForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("createdBy", data.createdBy);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      await handleUpdateCourse(course._id, formData);
      onClose();
    } catch {
      // Error handled by toast
    }
  };

  const inputClass = "w-full bg-neutral-900/50 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all placeholder:text-neutral-600";
  const errorClass = "w-full bg-red-500/5 border border-red-500/50 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600";
  const labelClass = "block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.15)" }}
      >
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(157, 180, 198,0.08)", background: "rgba(157, 180, 198,0.02)" }}>
          <h2 className="text-xl font-bold text-white">Edit Course</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="edit-course-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Course Title</label>
                <input type="text" className={errors.title ? errorClass : inputClass} {...register("title", { required: "Title is required" })} />
              </div>

              <div>
                <label className={labelClass}>Educator Name</label>
                <input type="text" className={errors.createdBy ? errorClass : inputClass} {...register("createdBy", { required: "Educator is required" })} />
              </div>

              <div>
                <label className={labelClass}>Price (₹)</label>
                <input type="number" step="0.01" className={errors.price ? errorClass : inputClass} {...register("price", { required: "Price is required", min: 0 })} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Course Description</label>
              <textarea rows={4} className={`${errors.description ? errorClass : inputClass} resize-none`} {...register("description", { required: "Description is required" })} />
            </div>

            <div>
              <label className={labelClass}>Update Cover Image (Optional)</label>
              <input type="file" accept="image/*" className={`w-full file:mr-5 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors ${inputClass} py-2 px-3`} {...register("thumbnail")} />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <motion.button
            form="edit-course-form"
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-amber-900 text-white shadow-lg  hover:opacity-90"
              }`}
          >
            {isSubmitting ? <><Spinner /> Saving...</> : "Save Changes"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
