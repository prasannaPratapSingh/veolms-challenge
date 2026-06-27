import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hook/auth.hook";

const NAV_LINKS = ["Courses", "How It Works", "Pricing", "Blog"];

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  // derive the name and avatar from however the API nests it
  const name: string =
    user?.data?.name ?? user?.user?.name ?? user?.name ?? "";
  const avatarUrl: string =
    user?.data?.avatarUrl ?? user?.user?.avatarUrl ?? user?.avatarUrl ?? "";
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onLogout = async () => {
    setDropdownOpen(false);
    await handleLogout();
    // Full page reload + replace — clears Redux, clears history entry,
    // prevents browser back/forward from restoring stale auth state.
    window.location.replace("/");
  };

  return (
    <motion.nav
      id="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "fixed top-0 left-0 right-0 z-[100] h-[68px] px-8",
        "flex items-center justify-between",
        "transition-all duration-300",
        scrolled
          ? "bg-[rgba(10,10,10,0.96)] backdrop-blur-[14px] shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-transparent",
      ].join(" ")}
    >
      {/* Logo */}
      <a
        href="/"
        className="text-[1.35rem] font-extrabold tracking-[-0.03em] text-white no-underline"
      >
        LearnSphere
      </a>

      {/* Nav links — hidden in minimal mode (dashboard etc.) */}
      {!minimal && (
        <ul className="flex gap-8 list-none m-0 p-0">
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-white/60 text-sm font-medium no-underline transition-colors duration-200 hover:text-white"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Auth area */}
      {user ? (
        /* ── Logged-in state ── */
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* Name */}
          <span className="text-white/60 text-sm font-medium hidden sm:block">
            {name}
          </span>

          {/* Avatar button */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-80 bg-white flex items-center justify-center"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-black text-sm font-bold">{initial}</span>
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-[calc(100%+0.6rem)] right-0 min-w-[160px] bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-white text-sm font-semibold leading-tight truncate">
                    {name}
                  </p>
                  <p className="text-white/35 text-xs mt-0.5">Learner</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer bg-transparent border-0 font-medium"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ── Guest state ── */
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-white/70 text-sm font-medium no-underline px-4 py-[0.45rem] rounded-md transition-colors duration-200 hover:text-white"
          >
            Log in
          </a>
          <motion.a
            href="/signup"
            whileHover={{ opacity: 0.88, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-black text-sm font-bold no-underline px-5 py-2 rounded-md inline-block"
          >
            Get Started
          </motion.a>
        </div>
      )}
    </motion.nav>
  );
}
