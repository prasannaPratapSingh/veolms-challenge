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

/* ─── Data ─── */
export const COURSES: Course[] = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    instructor: "Alex Morgan",
    level: "Beginner → Advanced",
    duration: "42h",
    lessons: 186,
    students: "12.4k",
    price: 79,
    tag: "Bestseller",
    emoji: "💻",
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    instructor: "Sara Chen",
    level: "Beginner",
    duration: "28h",
    lessons: 120,
    students: "8.1k",
    price: 59,
    tag: "New",
    emoji: "🎨",
  },
  {
    id: 3,
    title: "Data Science & Machine Learning",
    instructor: "Dr. Rajan Mehta",
    level: "Intermediate",
    duration: "56h",
    lessons: 240,
    students: "19.3k",
    price: 99,
    tag: "Top Rated",
    emoji: "📊",
  },
  {
    id: 4,
    title: "Product Management Essentials",
    instructor: "Lena Kovacs",
    level: "Intermediate",
    duration: "18h",
    lessons: 78,
    students: "5.6k",
    price: 49,
    tag: "",
    emoji: "📦",
  },
  {
    id: 5,
    title: "Cloud Architecture with AWS",
    instructor: "James Okafor",
    level: "Advanced",
    duration: "35h",
    lessons: 154,
    students: "7.9k",
    price: 89,
    tag: "Hot",
    emoji: "☁️",
  },
  {
    id: 6,
    title: "Digital Marketing Mastery",
    instructor: "Priya Nair",
    level: "Beginner",
    duration: "22h",
    lessons: 94,
    students: "10.2k",
    price: 39,
    tag: "",
    emoji: "📣",
  },
];

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
    title: "Get Certified",
    desc: "Earn verifiable certificates you can share on LinkedIn or attach to job applications.",
  },
];
