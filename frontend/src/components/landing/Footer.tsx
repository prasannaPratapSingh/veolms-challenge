import Lightfall from "../Lightfall";

const FOOTER_COLS = [
  {
    head: "Learn",
    links: ["All Courses", "Learning Paths", "Certifications", "Free Trials"],
  },
  {
    head: "Company",
    links: ["About", "Careers", "Press", "Blog"],
  },
  {
    head: "Support",
    links: ["Help Centre", "Community", "Instructor Hub", "Refund Policy"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(157, 180, 198,0.1)",
        overflow: "hidden",
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
        {/* Lightfall is a JS component; className/dpr/mixBlendMode are optional at runtime */}
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
        `}</style>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {/* Top grid */}
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "3rem",
              marginBottom: "4rem",
            }}
          >
            {/* Brand */}
            <div className="footer-brand">
              <a
                href="/"
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
              </a>
              <p
                style={{
                  color: "rgba(245, 248, 250,0.3)",
                  fontSize: "0.82rem",
                  lineHeight: 1.75,
                  maxWidth: "240px",
                  fontWeight: 300,
                }}
              >
                Practical, project-based education built for people who need results, not just certificates.
              </p>

              {/* Accent divider */}
              <div
                style={{
                  width: "32px",
                  height: "2px",
                  background: "rgba(157, 180, 198,0.4)",
                  marginTop: "1.5rem",
                }}
              />
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
                    <li key={link}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(245, 248, 250,0.3)",
                          fontSize: "0.82rem",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          fontWeight: 300,
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLElement).style.color = "rgba(245, 248, 250,0.7)")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLElement).style.color = "rgba(245, 248, 250,0.3)")
                        }
                      >
                        {link}
                      </a>
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
            <div style={{ display: "flex", gap: "1.75rem" }}>
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: "rgba(245, 248, 250,0.18)",
                    fontSize: "0.73rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    fontWeight: 300,
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(157, 180, 198,0.6)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(245, 248, 250,0.18)")
                  }
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

