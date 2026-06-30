import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../../lib/authInstance";
import CourseCard from "../../../components/landing/CourseCard";

/* ─── Types ─── */
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

type PriceFilter = "all" | "free" | "paid";
type SortFilter = "newest" | "oldest" | "price-asc" | "price-desc";

/* ─── Pill button ─── */
function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return (
    <button
      onClick={onClick}
      style={active
        ? { background: "#c8a96e", color: "#0e0d0b", border: "1px solid #c8a96e" }
        : { background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.12)", color: "rgba(237,232,223,0.5)" }}
      className="px-4 py-1.5 rounded-sm text-xs font-semibold transition-all duration-150 cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div style={{ background: "#161510", border: "1px solid rgba(200,169,110,0.08)" }} className="rounded-sm overflow-hidden animate-pulse">
      <div className="h-[180px]" style={{ background: "rgba(200,169,110,0.04)" }} />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded-sm w-4/5" style={{ background: "rgba(200,169,110,0.06)" }} />
        <div className="h-3 rounded-sm w-full" style={{ background: "rgba(200,169,110,0.04)" }} />
        <div className="h-3 rounded-sm w-3/5" style={{ background: "rgba(200,169,110,0.04)" }} />
        <div className="h-px my-2" style={{ background: "rgba(200,169,110,0.05)" }} />
        <div className="flex justify-between items-center">
          <div className="h-5 rounded-sm w-16" style={{ background: "rgba(200,169,110,0.06)" }} />
          <div className="h-8 rounded-sm w-24" style={{ background: "rgba(200,169,110,0.06)" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortFilter, setSortFilter] = useState<SortFilter>("newest");

  /* Fetch once on mount */
  useEffect(() => {
    axiosInstance
      .get("/course/")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setAllCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => setAllCourses([]))
      .finally(() => setLoading(false));
  }, []);

  /* Debounce search 300ms */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* Client-side filter + sort */
  const filtered = allCourses
    .filter((c) => {
      const matchesSearch = c.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesPrice =
        priceFilter === "all"
          ? true
          : priceFilter === "free"
          ? c.price === 0
          : c.price > 0;
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortFilter) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPriceFilter("all");
    setSortFilter("newest");
  }, []);

  const hasActiveFilters =
    debouncedSearch !== "" || priceFilter !== "all" || sortFilter !== "newest";

  return (
    <div className="min-h-screen pt-[68px]" style={{ background: "#0e0d0b", color: "#ede8df" }}>
      {/* ── Hero section ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 py-16"
        style={{ background: "#161510", borderBottom: "1px solid rgba(200,169,110,0.1)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1rem" }}
          >
            <span style={{ display: "block", width: "20px", height: "1px", background: "#c8a96e" }} />
            <span style={{ color: "#c8a96e", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>All Courses</span>
            <span style={{ display: "block", width: "20px", height: "1px", background: "#c8a96e" }} />
          </motion.div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#ede8df" }} className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Explore Courses
          </h1>
          <p style={{ color: "rgba(237,232,223,0.45)" }} className="text-base leading-relaxed mb-10 max-w-xl mx-auto font-light">
            Level up with expert-crafted courses. Pay once, learn at your own pace — no subscriptions.
          </p>

          {/* Search box */}
          <div className="relative max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(200,169,110,0.4)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses…"
              style={{ background: "#0e0d0b", border: "1px solid rgba(200,169,110,0.15)", color: "#ede8df" }}
              className="w-full rounded-sm pl-11 pr-4 py-3 text-sm outline-none auth-input placeholder:text-[rgba(237,232,223,0.2)]"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="px-6 py-4"
        style={{ borderBottom: "1px solid rgba(200,169,110,0.08)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span style={{ color: "rgba(200,169,110,0.4)", letterSpacing: "0.12em" }} className="text-xs font-semibold uppercase mr-1">Price</span>
            {(["all", "free", "paid"] as PriceFilter[]).map((f) => (
              <FilterPill key={f} active={priceFilter === f} onClick={() => setPriceFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </FilterPill>
            ))}
          </div>
          <div className="h-4 w-px hidden sm:block" style={{ background: "rgba(200,169,110,0.1)" }} />
          <div className="flex items-center gap-2">
            <span style={{ color: "rgba(200,169,110,0.4)", letterSpacing: "0.12em" }} className="text-xs font-semibold uppercase mr-1">Sort</span>
            {([ { value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }, { value: "price-asc", label: "Price: Low to High" }, { value: "price-desc", label: "Price: High to Low" } ] as { value: SortFilter; label: string }[]).map((s) => (
              <FilterPill key={s.value} active={sortFilter === s.value} onClick={() => setSortFilter(s.value)}>{s.label}</FilterPill>
            ))}
          </div>
          {!loading && (
            <span style={{ color: "rgba(200,169,110,0.35)" }} className="ml-auto text-xs">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Courses grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="w-16 h-16 rounded-sm flex items-center justify-center text-2xl" style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.12)" }}>
              🔍
            </div>
            <p style={{ color: "rgba(237,232,223,0.4)" }} className="text-base font-medium">No courses found</p>
            <p style={{ color: "rgba(237,232,223,0.22)" }} className="text-sm font-light">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{ background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.15)", color: "rgba(237,232,223,0.5)" }}
                className="mt-2 px-5 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer hover:text-[#ede8df]"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((course) => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
                }}
                className="h-full"
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
