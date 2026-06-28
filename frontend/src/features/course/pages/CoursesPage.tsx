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
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer border-0",
        active
          ? "bg-white text-black"
          : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-[14px] overflow-hidden animate-pulse">
      <div className="h-[180px] bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded w-4/5" />
        <div className="h-3 bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-white/[0.04] rounded w-3/5" />
        <div className="h-px bg-white/5 my-2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-white/[0.06] rounded w-16" />
          <div className="h-8 bg-white/[0.06] rounded w-24" />
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
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-[68px]">
      {/* ── Hero section ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0d0d0d] border-b border-white/[0.06] px-6 py-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block text-white/35 text-[0.7rem] font-bold tracking-[0.12em] uppercase mb-4"
          >
            All Courses
          </motion.span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Explore Courses
          </h1>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Level up with expert-crafted courses. Pay once, learn at your own pace — no subscriptions.
          </p>

          {/* Search box */}
          <div className="relative max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses…"
              className="w-full bg-[#111] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Filter bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="border-b border-white/[0.05] px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
          {/* Price filters */}
          <div className="flex items-center gap-2">
            <span className="text-white/25 text-xs font-semibold uppercase tracking-widest mr-1">
              Price
            </span>
            {(["all", "free", "paid"] as PriceFilter[]).map((f) => (
              <FilterPill key={f} active={priceFilter === f} onClick={() => setPriceFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </FilterPill>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Sort filters */}
          <div className="flex items-center gap-2">
            <span className="text-white/25 text-xs font-semibold uppercase tracking-widest mr-1">
              Sort
            </span>
            {(
              [
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ] as { value: SortFilter; label: string }[]
            ).map((s) => (
              <FilterPill
                key={s.value}
                active={sortFilter === s.value}
                onClick={() => setSortFilter(s.value)}
              >
                {s.label}
              </FilterPill>
            ))}
          </div>

          {/* Result count */}
          {!loading && (
            <span className="ml-auto text-white/25 text-xs">
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
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-white/40 text-base font-medium">No courses found</p>
            <p className="text-white/20 text-sm">Try adjusting your search or filters.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm font-medium rounded-lg transition-colors cursor-pointer"
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
