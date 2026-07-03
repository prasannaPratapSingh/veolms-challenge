/* ─── Types ─── */
export interface Course {
  id: number;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  lessons: number;
  students: string;
  price: number;
  tag: string;
  emoji: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
}

export interface Step {
  num: string;
  title: string;
  desc: string;
}


export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marcus Thiel",
    role: "Software Engineer · Shopify",
    text: "The Full-Stack course transformed how I think about systems. Within 3 months of completing it I landed my first senior role. The content is dense but never bloated.",
    initials: "MT",
  },
  {
    id: 2,
    name: "Anika Patel",
    role: "Product Designer · Figma",
    text: "I've tried four different platforms. LearnSphere is the only one where the instructors actually respond and the curriculum stays current. Night-and-day difference in quality.",
    initials: "AP",
  },
  {
    id: 3,
    name: "Carlos Reyes",
    role: "Data Analyst · Stripe",
    text: "Completed the Data Science track while working full-time. The self-paced format and lifetime access made it genuinely feasible. Worth every rupee.",
    initials: "CR",
  },
];

export const STEPS: Step[] = [
  {
    num: "01",
    title: "Browse & Enrol",
    desc: "Explore 500+ courses across tech, design, business and more. One-time purchase, lifetime access.",
  },
  {
    num: "02",
    title: "Learn at Your Pace",
    desc: "Stream HD video lessons, read supplementary notes, and complete hands-on projects — on any device.",
  },
  {
    num: "03",
    title: "Track Your Progress",
    desc: "Keep track of completed lessons, continue where you left off, and stay motivated as you progress through your course.",
  },
];
