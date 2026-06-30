import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../lib/authInstance";
import { toast } from "react-hot-toast";
import { useCourse } from "../../course/hook/course.hook";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Types ── */
interface Student {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  enrollmentCount: number;
}

interface CourseEnrollment {
  _id: string;
  enrolledAt: string;
  courseId: {
    _id: string;
    title: string;
    thumbnail?: string;
    price: number;
    isPublished: boolean;
  };
}

interface StudentDetail {
  student: Student;
  enrollments: CourseEnrollment[];
}

interface StudentsResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

/* ── Spinner ── */
function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "sm" ? "w-4 h-4 border-2" : "w-10 h-10 border-4";
  return <span className={`inline-block ${cls} border-white/20 border-t-white rounded-full animate-spin`} />;
}

/* ── StudentDetailModal ── */
function StudentDetailModal({ studentId, onClose, onEnrollmentRemoved }: { 
  studentId: string; 
  onClose: () => void;
  onEnrollmentRemoved: () => void;
}) {
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/students/${studentId}`);
      setData(res.data?.data ?? null);
    } catch {
      toast.error("Failed to load student details");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [studentId, onClose]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const handleRemoveEnrollment = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Remove enrollment for "${courseTitle}"? This cannot be undone.`)) return;
    setRemovingId(courseId);
    try {
      await axiosInstance.delete(`/admin/students/${studentId}/enrollments/${courseId}`);
      toast.success("Enrollment removed");
      setData(prev => prev ? {
        ...prev,
        enrollments: prev.enrollments.filter(e => e.courseId._id !== courseId),
      } : prev);
      onEnrollmentRemoved();
    } catch {
      toast.error("Failed to remove enrollment");
    } finally {
      setRemovingId(null);
    }
  };

  const initial = data?.student.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative w-full sm:max-w-xl bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-white text-base">Student Details</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : data ? (
          <div className="overflow-y-auto flex-1">
            {/* Student info */}
            <div className="px-6 py-5 flex items-center gap-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                {data.student.avatarUrl ? (
                  <img src={data.student.avatarUrl} alt={data.student.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white/60">{initial}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{data.student.name}</p>
                <p className="text-white/40 text-sm truncate">{data.student.email}</p>
                <p className="text-white/25 text-xs mt-0.5">
                  Joined {new Date(data.student.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <p className="text-2xl font-extrabold text-white">{data.enrollments.length}</p>
                <p className="text-white/30 text-xs">enrolled</p>
              </div>
            </div>

            {/* Enrollments */}
            <div className="px-6 py-4">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Enrolled Courses</p>
              {data.enrollments.length === 0 ? (
                <p className="text-white/25 text-sm py-6 text-center">No enrollments yet</p>
              ) : (
                <div className="space-y-2">
                  {data.enrollments.map(enr => (
                    <div key={enr._id} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden shrink-0">
                        {enr.courseId.thumbnail ? (
                          <img src={enr.courseId.thumbnail} alt={enr.courseId.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">—</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{enr.courseId.title}</p>
                        <p className="text-white/30 text-xs">
                          Enrolled {new Date(enr.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveEnrollment(enr.courseId._id, enr.courseId.title)}
                        disabled={removingId === enr.courseId._id}
                        className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40 shrink-0"
                        title="Remove enrollment"
                      >
                        {removingId === enr.courseId._id ? <Spinner /> : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

/* ── Main StudentsTab ── */
export default function StudentsTab() {
  const { handleGetAnalytics } = useCourse();
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await axiosInstance.get<{ data: StudentsResponse }>(`/admin/students?${params}`);
      const d = res.data?.data;
      setStudents(d?.students ?? []);
      setTotal(d?.total ?? 0);
      setTotalPages(d?.totalPages ?? 1);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs font-bold tracking-wider uppercase">
            Students
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1">Manage Students</h1>
          <p className="text-neutral-400 text-sm">{total} learner{total !== 1 ? "s" : ""} registered</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
      ) : students.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <svg className="w-10 h-10 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-white/30 font-medium">{debouncedSearch ? "No students match your search" : "No students yet"}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Enrolled</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {students.map((student, i) => (
                  <motion.tr key={student._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03, ease: EASE }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-white/60">{student.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="font-semibold text-white truncate max-w-[160px]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/50 truncate max-w-[200px]">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-white/70 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        {student.enrollmentCount} course{student.enrollmentCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/30 text-xs">
                      {new Date(student.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudentId(student._id)}
                        className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {students.map((student, i) => (
              <motion.div key={student._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03, ease: EASE }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {student.avatarUrl ? (
                    <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-white/60">{student.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{student.name}</p>
                  <p className="text-white/40 text-xs truncate">{student.email}</p>
                  <p className="text-white/25 text-xs mt-0.5">{student.enrollmentCount} enrolled</p>
                </div>
                <button
                  onClick={() => setSelectedStudentId(student._id)}
                  className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors shrink-0"
                >
                  View
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <p className="text-white/30 text-xs">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Student detail modal */}
      <AnimatePresence>
        {selectedStudentId && (
          <StudentDetailModal
            studentId={selectedStudentId}
            onClose={() => setSelectedStudentId(null)}
            onEnrollmentRemoved={() => {
              // Re-fetch analytics so the overview tab shows updated enrollment count
              handleGetAnalytics();
              // Also refresh the student list so enrollment count badge updates
              fetchStudents();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
