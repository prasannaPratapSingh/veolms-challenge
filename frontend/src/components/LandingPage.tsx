import { useEffect } from "react";
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import StatsBar from "./landing/StatsBar";
import CoursesSection from "./landing/CoursesSection";
import HowItWorks from "./landing/HowItWorks";
import Testimonials from "./landing/Testimonials";
import CTABanner from "./landing/CTABanner";
import Footer from "./landing/Footer";

export default function LandingPage() {
  useEffect(() => {
    document.title = "LearnSphere — Learn skills that move careers forward";

    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fonts);

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "LearnSphere is an online learning platform with 500+ expert-led courses in tech, design, and business. Buy once, learn forever.";

    return () => {
      document.head.removeChild(fonts);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Helvetica', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
        background: "#0B0F14",
        "--accent": "#9DB4C6",
        "--accent-muted": "rgba(157, 180, 198,0.15)",
        "--surface": "#1E2A39",
        "--surface-2": "#1E2A39",
        "--border": "rgba(157, 180, 198,0.12)",
        "--text": "#F5F8FA",
        "--text-muted": "rgba(245, 248, 250,0.45)",
      } as React.CSSProperties}
    >
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <CoursesSection />
        <HowItWorks />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
