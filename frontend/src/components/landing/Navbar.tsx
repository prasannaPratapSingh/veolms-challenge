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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      <style>{`
        .nav-link {
          color: rgba(245, 248, 250,0.5);
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #9DB4C6;
          transition: width 0.2s ease;
        }
        .nav-link:hover { color: #F5F8FA; }
        .nav-link:hover::after { width: 100%; }
      `}</style>

      <motion.nav
        id="navbar"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: scrolled && !mobileOpen ? "1.5rem" : 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          width: scrolled && !mobileOpen ? "calc(100% - 3rem)" : "100%",
          maxWidth: scrolled && !mobileOpen ? "1200px" : "100%",
          borderRadius: scrolled && !mobileOpen ? "1.5rem" : 0,
          zIndex: 100,
          height: "68px",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: scrolled || mobileOpen
            ? "rgba(11, 15, 20, 0.35)"
            : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled || mobileOpen ? "blur(24px) saturate(180%)" : "none",
          border: scrolled || mobileOpen
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid transparent",
          boxShadow: scrolled || mobileOpen
            ? "0 10px 40px rgba(0, 0, 0, 0.2)"
            : "none",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          style={{
            fontFamily: "'Helvetica', Arial, sans-serif",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#F5F8FA",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          LearnSphere
        </Link>

        {/* Desktop nav links */}
        {!minimal && (
          <ul
            style={{
              display: "flex",
              gap: "2.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="nav-desktop"
          >
            <style>{`
              @media (max-width: 767px) { .nav-desktop { display: none !important; } }
            `}</style>
            {NAV_LINKS.map((item) => (
              <li key={item}>
                {item === "Courses" ? (
                  <Link to="/courses" className="nav-link">
                    {item}
                  </Link>
                ) : (
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="nav-link"
                  >
                    {item}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Desktop auth */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            className="auth-desktop"
          >
            <style>{`
              @media (max-width: 767px) { .auth-desktop { display: none !important; } }
            `}</style>
            {user ? (
              <div
                style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.75rem" }}
                ref={dropdownRef}
              >
                <span
                  style={{
                    color: "rgba(245, 248, 250,0.5)",
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    display: "none",
                  }}
                  className="name-sm"
                >
                  {name}
                </span>
                <style>{`@media (min-width: 640px) { .name-sm { display: block !important; } }`}</style>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid rgba(157, 180, 198,0.3)",
                    flexShrink: 0,
                    cursor: "pointer",
                    background: "#1F2A39",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.2s",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        (e.currentTarget.nextSibling as HTMLElement | null)?.style.setProperty("display", "flex");
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      color: "#9DB4C6",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      display: avatarUrl ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {initial}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 0.6rem)",
                        right: 0,
                        minWidth: "160px",
                        background: "#1F2A39",
                        border: "1px solid rgba(157, 180, 198,0.12)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.75rem 1rem",
                          borderBottom: "1px solid rgba(157, 180, 198,0.08)",
                        }}
                      >
                        <p style={{ color: "#F5F8FA", fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>
                          {name}
                        </p>
                      </div>
                      {[
                        { label: "Dashboard", to: "/dashboard" },
                        { label: "Profile", to: "/profile" },
                      ].map(({ label, to }) => (
                        <Link
                          key={label}
                          to={to}
                          onClick={() => setDropdownOpen(false)}
                          style={{ display: "block", textDecoration: "none" }}
                        >
                          <button
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.7rem 1rem",
                              fontSize: "0.8rem",
                              color: "rgba(245, 248, 250,0.5)",
                              background: "transparent",
                              border: 0,
                              cursor: "pointer",
                              fontFamily: "'Helvetica', Arial, sans-serif",
                              transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#F5F8FA";
                              (e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.5)";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            {label}
                          </button>
                        </Link>
                      ))}
                      <button
                        onClick={onLogout}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.7rem 1rem",
                          fontSize: "0.8rem",
                          color: "rgba(245, 248, 250,0.5)",
                          background: "transparent",
                          border: 0,
                          cursor: "pointer",
                          fontFamily: "'Helvetica', Arial, sans-serif",
                          transition: "color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#F5F8FA";
                          (e.currentTarget as HTMLElement).style.background = "rgba(157, 180, 198,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.5)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
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
                  style={{
                    color: "rgba(245, 248, 250,0.55)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    padding: "0.45rem 0.8rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F5F8FA")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.55)")}
                >
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    style={{
                      background: "#9DB4C6",
                      color: "#0B0F14",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      padding: "0.5rem 1.3rem",
                      borderRadius: "4px",
                      display: "inline-block",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile: avatar + hamburger */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            className="mobile-controls"
          >
            <style>{`@media (min-width: 768px) { .mobile-controls { display: none !important; } }`}</style>
            {user && (
              <button
                onClick={() => { setMobileOpen(false); navigate("/dashboard"); }}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid rgba(157, 180, 198,0.3)",
                  flexShrink: 0,
                  background: "#1F2A39",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      (e.currentTarget.nextSibling as HTMLElement | null)?.style.setProperty("display", "flex");
                    }}
                  />
                ) : null}
                <span
                  style={{
                    color: "#9DB4C6",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: avatarUrl ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {initial}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                padding: "0.35rem",
                color: "rgba(245, 248, 250,0.6)",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              {mobileOpen ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "68px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(11, 15, 20, 0.45)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
            className="mobile-drawer"
          >
            <style>{`@media (min-width: 768px) { .mobile-drawer { display: none !important; } }`}</style>
            <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {!minimal && NAV_LINKS.map((item) =>
                item === "Courses" ? (
                  <Link
                    key={item}
                    to="/courses"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      color: "rgba(245, 248, 250,0.6)",
                      fontSize: "0.95rem",
                      fontWeight: 400,
                      padding: "0.8rem 0",
                      borderBottom: "1px solid rgba(157, 180, 198,0.07)",
                      textDecoration: "none",
                      display: "block",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </Link>
                ) : (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      color: "rgba(245, 248, 250,0.6)",
                      fontSize: "0.95rem",
                      fontWeight: 400,
                      padding: "0.8rem 0",
                      borderBottom: "1px solid rgba(157, 180, 198,0.07)",
                      textDecoration: "none",
                      display: "block",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </a>
                )
              )}

              {user ? (
                <div style={{ paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {[
                    { label: "Dashboard", to: "/dashboard" },
                    { label: "Profile", to: "/profile" },
                  ].map(({ label, to }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        color: "rgba(245, 248, 250,0.6)",
                        fontSize: "0.95rem",
                        padding: "0.8rem 0",
                        borderBottom: "1px solid rgba(157, 180, 198,0.07)",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={onLogout}
                    style={{
                      textAlign: "left",
                      color: "rgba(245, 248, 250,0.6)",
                      fontSize: "0.95rem",
                      padding: "0.8rem 0",
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontFamily: "'Helvetica', Arial, sans-serif",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div style={{ paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      textAlign: "center",
                      color: "rgba(245, 248, 250,0.7)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      padding: "0.8rem",
                      border: "1px solid rgba(157, 180, 198,0.15)",
                      borderRadius: "4px",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      textAlign: "center",
                      background: "#9DB4C6",
                      color: "#0B0F14",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      padding: "0.8rem",
                      borderRadius: "4px",
                      textDecoration: "none",
                      display: "block",
                    }}
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
