import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = ["Courses", "How It Works", "Pricing", "Blog"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      id="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          fontSize: "1.35rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        LearnSphere
      </a>

      {/* Desktop links */}
      <ul
        style={{
          display: "flex",
          gap: "2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {NAV_LINKS.map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")
              }
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <a
          href="/login"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.875rem",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.45rem 1rem",
            borderRadius: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")
          }
        >
          Log in
        </a>
        <motion.a
          href="/signup"
          whileHover={{ opacity: 0.88, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#fff",
            color: "#000",
            fontSize: "0.875rem",
            fontWeight: 700,
            textDecoration: "none",
            padding: "0.5rem 1.25rem",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          Get Started
        </motion.a>
      </div>
    </motion.nav>
  );
}
