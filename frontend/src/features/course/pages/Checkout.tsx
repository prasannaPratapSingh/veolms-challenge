import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axiosInstance from "../../../lib/authInstance";

/* Allow TS to see Razorpay loaded from CDN */
declare const Razorpay: any;

/* ─── Types ─── */
interface Lesson {
  _id: string;
  title: string;
  duration: number;
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
  sections: Section[];
}

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
}

/* ─── Helpers ─── */
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

/* ─── Load Razorpay script dynamically ─── */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="razorpay"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.head.appendChild(script);
  });
}

/* ─── Skeleton ─── */
function SkeletonBlock({ className }: { className: string }) {
  return (
    <div style={{ background: "rgba(157, 180, 198,0.06)" }} className={`rounded-sm animate-pulse ${className}`} />
  );
}

export default function Checkout() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);
  const userName: string =
    user?.data?.name ?? user?.user?.name ?? user?.name ?? "";
  const userEmail: string =
    user?.data?.email ?? user?.user?.email ?? user?.email ?? "";

  const [course, setCourse] = useState<CourseData | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Fetch course info + check enrollment */
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = axiosInstance
      .get(`/course/getCourse/${courseId}`)
      .then((res) => {
        const d = res.data;
        setCourse(d?.data ?? d);
      })
      .catch(() => navigate("/"));

    const checkEnrollment = axiosInstance
      .get(`/enrollment/course/${courseId}`)
      .then(() => {
        // Already enrolled → skip checkout
        navigate(`/course/${courseId}/learn`, { replace: true });
      })
      .catch(() => {
        // Not enrolled — expected, stay on page
      });

    Promise.all([fetchCourse, checkEnrollment]).finally(() =>
      setCourseLoading(false)
    );
  }, [courseId, navigate]);

  const handlePay = async () => {
    if (!course || !courseId) return;
    setError(null);
    setPayLoading(true);

    try {
      await loadRazorpayScript();

      const res = await axiosInstance.post("/payment/create-order", { courseId });
      const orderData: OrderData = res.data?.data ?? res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LearnSphere",
        description: course.title,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post("/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId,
            });
            navigate(`/course/${courseId}/learn`);
          } catch (verifyErr: any) {
            // 409 = enrollment already exists, navigate to learn anyway
            const status = verifyErr?.response?.status;
            if (status === 409) {
              navigate(`/course/${courseId}/learn`);
            } else {
              setError(
                verifyErr?.response?.data?.message ??
                  "Payment verification failed. Please contact support."
              );
            }
          }
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: "#ffffff" },
        modal: {
          ondismiss: () => setPayLoading(false),
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPayLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400 && err?.response?.data?.message?.toLowerCase().includes("already enrolled")) {
        navigate(`/course/${courseId}/learn`);
        return;
      }
      setError(
        err?.response?.data?.message ?? "Failed to initiate payment. Please try again."
      );
      setPayLoading(false);
    }
  };

  /* ─── Loading skeleton ─── */
  if (courseLoading) {
    return (
      <div className="min-h-screen pt-[68px]" style={{ background: "#0B0F14" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <SkeletonBlock className="w-full aspect-video" />
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <SkeletonBlock className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const lessons = totalLessons(course.sections);
  const duration = totalDuration(course.sections);

  return (
    <div className="min-h-screen pt-[68px]" style={{ background: "#0B0F14", color: "#F5F8FA" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8"
      >
        {/* ── Left panel: Course summary ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Back link */}
          <Link
            to={`/course/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-[#9DB4C6] transition-colors no-underline"
            style={{ color: "rgba(157, 180, 198,0.45)" }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to course
          </Link>

          {/* Thumbnail */}
          <div className="w-full aspect-video rounded-sm overflow-hidden" style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.1)" }}>
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "rgba(157, 180, 198,0.2)" }}>No Cover</div>
            )}
          </div>

          {/* Title + description */}
          <div>
            <h1 style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-3">
              {course.title}
            </h1>
            <p style={{ color: "rgba(245, 248, 250,0.42)" }} className="text-sm leading-relaxed line-clamp-3 font-light">
              {course.description}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            {[`▶ ${lessons} lessons`, `⏱ ${duration}`, `📚 ${course.sections.length} sections`].map(label => (
              <span key={label} className="flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-medium"
                style={{ background: "rgba(157, 180, 198,0.06)", border: "1px solid rgba(157, 180, 198,0.12)", color: "rgba(245, 248, 250,0.5)" }}>
                {label}
              </span>
            ))}
          </div>

          {/* Sections list */}
          {course.sections.length > 0 && (
            <div className="space-y-2">
              <h2 style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="text-xs font-semibold uppercase mb-3">
                What's included
              </h2>
              {course.sections.map((section) => (
                <div
                  key={section._id}
                  className="flex items-center justify-between px-4 py-3 rounded-sm"
                  style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.08)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span style={{ color: "rgba(157, 180, 198,0.3)" }} className="text-xs font-bold w-5 shrink-0 text-right">
                      {section.order + 1}
                    </span>
                    <span style={{ color: "rgba(245, 248, 250,0.7)" }} className="text-sm font-medium truncate">
                      {section.title}
                    </span>
                  </div>
                  <span style={{ color: "rgba(157, 180, 198,0.4)" }} className="text-xs shrink-0 ml-4">
                    {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel: Billing card ── */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-6 space-y-5 sticky top-[88px] rounded-sm"
            style={{ background: "#1F2A39", border: "1px solid rgba(157, 180, 198,0.12)" }}
          >
            <h2 style={{ color: "#F5F8FA", fontFamily: "'Helvetica', Arial, sans-serif" }} className="text-lg font-bold tracking-tight">Order Summary</h2>

            {/* Course line */}
            <div className="flex items-start justify-between gap-3">
              <p style={{ color: "rgba(245, 248, 250,0.55)" }} className="text-sm leading-snug">{course.title}</p>
              <span style={{ color: "#F5F8FA" }} className="text-sm font-bold shrink-0">₹{course.price}</span>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(157, 180, 198,0.08)" }} />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span style={{ color: "rgba(245, 248, 250,0.55)" }} className="text-sm font-semibold">Total</span>
              <span style={{ fontFamily: "'Helvetica', Arial, sans-serif", color: "#F5F8FA" }} className="text-xl font-extrabold tracking-tight">₹{course.price}</span>
            </div>

            {/* Pay button */}
            <motion.button
              whileHover={{ boxShadow: payLoading ? "none" : "0 0 24px rgba(157, 180, 198,0.25)" }}
              whileTap={{ scale: payLoading ? 1 : 0.97 }}
              onClick={handlePay}
              disabled={payLoading}
              style={{ background: payLoading ? "rgba(157, 180, 198,0.3)" : "#9DB4C6", color: "#0B0F14" }}
              className="w-full font-bold text-sm py-3.5 rounded-sm cursor-pointer border-0 flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-all"
            >
              {payLoading ? (
                <>
                  <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(11, 15, 20,0.2)", borderTopColor: "#0B0F14" }} />
                  Processing…
                </>
              ) : (
                `Pay ₹${course.price}`
              )}
            </motion.button>

            {/* Error */}
            {error && (
              <p style={{ color: "#e07070" }} className="text-xs text-center leading-relaxed">
                {error}
              </p>
            )}

            {/* Trust note */}
            <p style={{ color: "rgba(157, 180, 198,0.35)" }} className="text-xs text-center">
              Secured by Razorpay · Pay once, learn forever
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
