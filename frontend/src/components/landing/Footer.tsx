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
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "4rem 1.5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <a
              href="/"
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#fff",
                textDecoration: "none",
                letterSpacing: "-0.03em",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              veo<span style={{ opacity: 0.35 }}>lms</span>
            </a>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.84rem",
                lineHeight: 1.7,
                maxWidth: "240px",
              }}
            >
              Practical, project-based education built for people who need results, not just certificates.
            </p>
          </div>

          {/* Links */}
          {FOOTER_COLS.map((col) => (
            <div key={col.head}>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
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
                  gap: "0.55rem",
                }}
              >
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "0.84rem",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)")
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
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.77rem", margin: 0 }}>
            © {new Date().getFullYear()} Veolms. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "rgba(255,255,255,0.22)",
                  fontSize: "0.77rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.22)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
