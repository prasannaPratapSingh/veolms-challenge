import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../features/auth/hook/auth.hook";

const NAV_LINKS = ["Courses", "How It Works", "Pricing", "Blog"];

export default function Navbar({ minimal = false }: { minimal?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.auth.user);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const onLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await handleLogout();
    window.location.replace("/");
  };

  return (
    <>
      <motion.nav
        id="navbar"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={[
          "fixed top-0 left-0 right-0 z-[100] h-[68px] px-5 sm:px-8",
          "flex items-center justify-between",
          "transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-[rgba(10,10,10,0.98)] backdrop-blur-[14px] shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-[1.2rem] sm:text-[1.35rem] font-extrabold tracking-[-0.03em] text-white no-underline shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          LearnSphere
        </Link>

        {/* Desktop nav links */}
        {!minimal && (
          <ul className="hidden md:flex gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((item) => (
              <li key={item}>
                {item === "Courses" ? (
                  <Link
                    to="/courses"
                    className="text-white/60 text-sm font-medium no-underline transition-colors duration-200 hover:text-white"
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-white/60 text-sm font-medium no-underline transition-colors duration-200 hover:text-white"
                  >
                    {item}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <span className="text-white/60 text-sm font-medium hidden sm:block">{name}</span>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-80 bg-white flex items-center justify-center"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-black text-sm font-bold">{initial}</span>
                  )}
                </button>
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
                        <p className="text-white text-sm font-semibold leading-tight truncate">{name}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer bg-transparent border-0 font-medium">
                          Dashboard
                        </button>
                      </Link>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer bg-transparent border-0 font-medium">
                          Profile
                        </button>
                      </Link>
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer bg-transparent border-0 font-medium"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/70 text-sm font-medium no-underline px-4 py-[0.45rem] rounded-md transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <motion.div whileHover={{ opacity: 0.88, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="bg-white text-black text-sm font-bold no-underline px-5 py-2 rounded-md inline-block"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile: avatar (if logged in) + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <button
                onClick={() => { setMobileOpen(false); navigate("/dashboard"); }}
                className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white flex items-center justify-center"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-black text-xs font-bold">{initial}</span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                /* X icon */
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger */
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[68px] left-0 right-0 z-[99] bg-[rgba(10,10,10,0.98)] backdrop-blur-[14px] border-b border-white/[0.06] md:hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {/* Nav links */}
              {!minimal && NAV_LINKS.map((item) => (
                item === "Courses" ? (
                  <Link
                    key={item}
                    to="/courses"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 text-base font-medium py-3 border-b border-white/[0.05] no-underline hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 text-base font-medium py-3 border-b border-white/[0.05] no-underline hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                )
              ))}

              {/* Auth section */}
              {user ? (
                <div className="pt-3 flex flex-col gap-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 text-base font-medium py-3 border-b border-white/[0.05] no-underline hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70 text-base font-medium py-3 border-b border-white/[0.05] no-underline hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="text-left text-white/70 text-base font-medium py-3 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-4 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-white/80 text-sm font-semibold py-3 border border-white/10 rounded-xl no-underline hover:bg-white/5 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-center bg-white text-black text-sm font-bold py-3 rounded-xl no-underline hover:bg-neutral-100 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
