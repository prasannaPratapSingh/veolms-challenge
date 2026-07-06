import { Link } from "react-router";
import Lightfall from "../Lightfall";
import { useMediaQuery } from "../../lib/useMediaQuery";

const FOOTER_COLS = [
  {
    head: "Platform",
    links: [
      { label: "Browse Courses", to: "/courses" },
      { label: "How It Works", anchor: "#how-it-works" },
      { label: "Student Reviews", anchor: "#testimonials" },
    ],
  },
  {
    head: "Account",
    links: [
      { label: "Sign Up", to: "/signup" },
      { label: "Log In", to: "/login" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Profile", to: "/profile" },
    ],
  },
];

export default function Footer() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(157, 180, 198,0.1)",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* Lightfall animated background — desktop only */}
      {isDesktop && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* @ts-ignore */}
          <Lightfall
            colors={["#00ddff", "#ffffff", "#9cefff", "#ffffff"]}
            backgroundColor="#000000"
            speed={0.6}
            streakCount={5}
            streakWidth={0.2}
            streakLength={1}
            density={0.5}
            twinkle={1}
            glow={0.2}
            backgroundGlow={3}
            zoom={1}
            opacity={1}
            mouseInteraction
            mouseStrength={0.5}
            mouseRadius={1}
          />
        </div>
      )}

      {/* Content sits above the animation */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "5rem 1.5rem 2.5rem",
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr 1fr !important; }
            .footer-brand { grid-column: 1 / -1; }
          }
          @media (max-width: 480px) {
            .footer-grid { grid-template-columns: 1fr !important; }
          }
          .footer-link {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.82rem;
            text-decoration: none;
            transition: color 0.2s;
            font-weight: 300;
            display: inline-block;
            padding: 0.15rem 0;
          }
          .footer-link:hover {
            color: rgba(255, 255, 255, 1);
          }
        `}</style>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {/* Top grid */}
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "3rem",
              marginBottom: "4rem",
            }}
          >
            {/* Brand */}
            <div className="footer-brand">
              <Link
                to="/"
                style={{
                  fontFamily: "'Helvetica', Arial, sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                LearnSphere
              </Link>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.82rem",
                  lineHeight: 1.75,
                  maxWidth: "280px",
                  fontWeight: 300,
                }}
              >
                Practical, project-based education built for people who need results, not just certificates.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.head}>
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "1.25rem",
                    margin: "0 0 1.25rem",
                  }}
                >
                  {col.head}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className="footer-link">
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.anchor} className="footer-link">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(157, 180, 198,0.08)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                color: "rgba(245, 248, 250,0.18)",
                fontSize: "0.73rem",
                margin: 0,
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              © {new Date().getFullYear()} LearnSphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
