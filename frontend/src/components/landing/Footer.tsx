import { Link } from "react-router";
import Lightfall from "../Lightfall";

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
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(157, 180, 198,0.1)",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* Lightfall animated background */}
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
            color: rgba(245, 248, 250,0.3);
            font-size: 0.82rem;
            text-decoration: none;
            transition: color 0.2s;
            font-weight: 300;
            display: inline-block;
            padding: 0.15rem 0;
          }
          .footer-link:hover {
            color: rgba(245, 248, 250,0.7);
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
                  color: "#F5F8FA",
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
                  color: "rgba(245, 248, 250,0.3)",
                  fontSize: "0.82rem",
                  lineHeight: 1.75,
                  maxWidth: "280px",
                  fontWeight: 300,
                }}
              >
                Practical, project-based education built for people who need results, not just certificates.
              </p>

              {/* Social links */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                {[
                  {
                    label: "GitHub",
                    icon: (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Twitter",
                    icon: (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    style={{
                      color: "rgba(245, 248, 250,0.2)",
                      transition: "color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(157, 180, 198,0.1)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.6)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "rgba(245, 248, 250,0.2)")
                    }
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.head}>
                <p
                  style={{
                    color: "#9DB4C6",
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
