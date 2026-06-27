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

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "LearnSphere is an online learning platform with 500+ expert-led courses in tech, design, and business. Buy once, learn forever.";

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
        background: "#0a0a0a",
      }}
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
