// Static course catalog. Edit copy here without touching React components.
// `courseKey` matches the `course_key` column on the DB `classes` table — that link drives
// scheduled date/time/price/seat info on the public site.
import classPistol from "@/assets/class-pistol.jpg";
import classPistolPerformance2 from "@/assets/class-pistol-performance-2.jpg";
import classPistolFundamental from "@/assets/class-pistol-fundamental.jpg";
import classCarbine from "@/assets/class-scoped-carbine.jpg";
import classCarbine2 from "@/assets/class-scoped-carbine-1.jpg";

import classDefensive from "@/assets/class-defensive.jpg";
import cprFlyer from "@/assets/cpr-certification.png";
import type { Course, CourseKey } from "@/features/courses/types";

const RENTAL_NOTE =
  "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.";

export const COURSE_CATALOG: Course[] = [
  {
    courseKey: "pistol-performance",
    title: "Pistol Performance",
    image: classPistol,
    fallbackPrice: "$225",
    fallbackLevel: "All Levels",
    description:
      "For individuals seeking to develop safe, effective, and responsible firearm skills, our professional instruction is tailored to both new shooters and experienced firearm owners looking to elevate their performance in a structured, safety-focused environment.",
    details: [
      "All courses are led by an instructor who is both NRA-certified and P.O.S.T.-certified, ensuring a high standard of training grounded in proven methodology and professional experience.",
      "Each course emphasizes safety, accountability, and real-world application, while delivering clear, step-by-step coaching to build confidence and competence at every level.",
      "Advanced grip and recoil management",
      "Accuracy and consistency drills",
      "Efficient draw and presentation",
      "Target transitions",
      "Attack and control",
      "Speed vs. precision balance",
      "Performance-based shooting drills / Competition style stages",
      "This course focuses on developing speed, accuracy, and efficiency under structured drills.",
    ],
    requirements: [
      "Reliable Pistol",
      "500 round count",
      "At least two magazines",
      "Magazine carriers",
      "OWB (Outside the waistband) or IWB (Inside the waistband) Holster (no nylon holsters permitted)",
      "Reliable and sturdy EDC (everyday carry) belt",
      "Eye and ear protection",
      "Appropriate clothing for range (pants, shirt, closed-toe shoes)",
      "Weapons maintenance & cleaning equipment",
      "Water and snacks",
      "Chair",
    ],
    rentalNote: RENTAL_NOTE,
  },
  {
    courseKey: "pistol-performance-2",
    title: "Pistol Performance II",
    image: classPistolPerformance2,
    fallbackPrice: "$260",
    fallbackLevel: "Intermediate / Advanced",
    description:
      "Pistol Performance II is the next step for shooters who have a solid grasp of the fundamentals and are ready to push their speed, accuracy, and efficiency under more demanding conditions. This course builds directly on Pistol Performance, refining technique and exposing weaknesses through advanced drills and performance-based stages.",
    details: [
      "All courses are led by an instructor who is both NRA-certified and P.O.S.T.-certified, ensuring a high standard of training grounded in proven methodology and professional experience.",
      "Each course emphasizes safety, accountability, and real-world application, while delivering clear, step-by-step coaching to build confidence and competence at every level.",
      "Advanced grip and recoil management",
      "Accuracy and consistency drills",
      "Efficient draw and presentation",
      "Target transitions",
      "Attack and control",
      "Speed vs. precision balance",
      "Performance-based shooting drills / Competition style stages",
      "This course focuses on developing speed, accuracy, and efficiency under structured drills.",
    ],
    requirements: [
      "Reliable Pistol",
      "500 round count",
      "At least two magazines",
      "Magazine carriers",
      "OWB (Outside the waistband) or IWB (Inside the waistband) Holster (no nylon holsters permitted)",
      "Reliable and sturdy EDC (everyday carry) belt",
      "Eye and ear protection",
      "Appropriate clothing for range (pants, shirt, closed-toe shoes)",
      "Weapons maintenance & cleaning equipment",
      "Water and snacks",
      "Chair",
    ],
    rentalNote: RENTAL_NOTE,
  },
  {
    courseKey: "baseline-pistol",
    title: "Baseline Pistol Course",
    image: classPistolFundamental,
    fallbackPrice: "$180",
    fallbackLevel: "All Levels",
    description:
      "Whether you've never touched a firearm or you're looking to sharpen your fundamentals, this course is designed to build real confidence and measurable skill from the ground up.",
    details: [
      "Many shooters plateau early due to gaps in fundamentals. This course fixes that.",
      "You'll learn:",
      "Proven firearm safety principles you can rely on under stress",
      "How your pistol actually works so you're not just \"using it,\" you understand it",
      "Proper grip, stance, and trigger control for consistent accuracy",
      "Safe and efficient loading/unloading procedures",
      "Core marksmanship fundamentals used by experienced shooters",
      "Professional range etiquette and safety standards",
      "This isn't just a beginner class. It's a foundation course. New shooters leave with confidence and clarity. Experienced shooters leave with tighter groups, better control, and a deeper understanding of their mechanics.",
    ],
    requirements: [
      "Reliable Pistol",
      "300–400 round count",
      "At least two magazines",
      "Magazine carriers",
      "OWB (Outside the waistband) or IWB (Inside the waistband) Holster (no nylon holsters permitted)",
      "Reliable and sturdy EDC (everyday carry) belt",
      "Eye and ear protection",
      "Appropriate clothing for range (pants, shirt, closed-toe shoes)",
      "Weapons maintenance & cleaning equipment",
      "Water and snacks",
      "Chair",
    ],
    rentalNote: RENTAL_NOTE,
  },
  {
    courseKey: "defensive-dynamic",
    title: "Defensive Dynamic Performance",
    image: classDefensive,
    fallbackPrice: "$265",
    fallbackLevel: "Intermediate",
    description:
      "The Defensive Dynamic Performance Course is designed to bridge the gap between traditional defensive firearms training and performance-based shooting. This course introduces shooters to competition-style stages built around realistic defensive applications, requiring both technical proficiency and critical decision-making under pressure.",
    details: [
      "Students will engage in structured, stage-based scenarios that emphasize marksmanship, movement, efficiency, and problem-solving. Unlike static training environments, this course forces shooters to process information, manage their weapon systems, and execute fundamentals at speed in evolving situations.",
      "This is not a fundamentals-only course. It is a performance validation environment where shooters must apply their existing skills in a dynamic setting that exposes strengths, limitations, and decision-making habits. Through guided instruction and performance-based feedback, students will develop the ability to:",
      "Apply fundamentals under stress",
      "Think critically while engaging targets",
      "Balance speed and accountability",
      "Adapt to changing problems in real time",
      "Execute competition-style shooting stages with defensive context and accountability",
      "Perform effective target transitions under time and cognitive pressure",
      "Utilize movement, positioning, and use of cover within stage design",
      "Demonstrate proper weapons manipulation (reloads, malfunctions, transitions) under stress",
      "Make rapid shoot/no-shoot and priority decisions based on stage conditions",
      "Identify and correct performance deficiencies through instructor-led self-diagnosis",
      "Integrate movement with shooting while maintaining control and awareness",
      "This course is open to competent, safety-conscious shooters who are looking to elevate their capability beyond static drills and into applied defensive performance.",
    ],
    requirements: [
      "Carbine",
      "Pistol",
      "IFAK",
      "Tourniquet (TQ)",
      "Duty Belt with OWB or IWB Holster (No SERPA)",
      "Rifle sling",
      "At least 3 rifle magazines",
      "At least 3 pistol magazines",
      "500 rounds rifle / 500 rounds pistol",
      "2 magazine holders for pistol magazines (mag pouch)",
      "1 magazine holder for rifle magazines (mag pouch)",
      "Eye and ear protection",
      "Appropriate clothing for terrain and weather",
      "Weapons maintenance & cleaning equipment",
      "Sunscreen",
      "Food and water",
      "Permanent marker",
    ],
    rentalNote: RENTAL_NOTE,
  },
  {
    courseKey: "scope-carbine-1",
    title: "American Rifleman I",
    image: classCarbine,
    fallbackPrice: "$350",
    fallbackLevel: "All Levels",
    forceComingSoon: true,
    description:
      "The Scope Carbine I course introduces shooters to the fundamentals of running a scoped rifle with precision and consistency. This course is designed for shooters who want to develop a true understanding of their optic, their rifle, and the principles that drive accurate shooting at distance. Class size is limited to 6 students for maximum instructor attention.",
    details: [
      "This course bridges the gap between general carbine work and precision rifle shooting. Students will learn how to properly set up a scoped rifle, understand their optic's reticle and turrets, and apply marksmanship fundamentals from a variety of positions.",
      "In this course, you will develop:",
      "Proper scope mounting, leveling, and zeroing procedures",
      "Understanding of MOA vs MIL and reticle subtensions",
      "Correct body position and natural point of aim",
      "Use of bipod, bag, and barricade support",
      "Prone, kneeling, and improvised shooting positions",
      "Wind reading basics and environmental considerations",
      "Calling your shots and self-diagnosing misses",
      "By the end of the course, students will have a confident, repeatable process for engaging targets at distance with a scoped carbine.",
    ],
    requirements: [
      "Scoped rifle (zeroed if possible)",
      "300 rounds of rifle ammunition",
      "Rifle sling",
      "At least 3 rifle magazines",
      "Bipod or shooting bag",
      "Belt / Chest Rig",
      "Magazine holders for rifle magazines",
      "Ear & Eye Protection",
      "Permanent Marker & notebook",
      "Appropriate clothing for terrain and weather",
      "Weapons maintenance & cleaning equipment",
      "Food & Water",
    ],
    rentalNote: RENTAL_NOTE,
  },
  {
    courseKey: "scope-carbine-2",
    title: "American Rifleman II",
    image: classCarbine,

    fallbackPrice: "$375",
    fallbackLevel: "Intermediate",
    forceComingSoon: true,
    description:
      "Scope Carbine II builds directly on the foundation established in Scope Carbine I. This course pushes shooters into extended distance engagements, advanced positional work, and real-world problem solving with a scoped rifle. Class size is limited to 6 students.",
    details: [
      "This is a performance-based course that demands a working knowledge of your optic, rifle, and fundamentals. Students will be challenged with longer distances, time pressure, and unconventional shooting positions.",
      "In this course, you will develop:",
      "Extended distance engagements with holdovers and dialed corrections",
      "Advanced wind calls and environmental adjustments",
      "Shooting from barricades, rooftops, and improvised supports",
      "Positional transitions under time pressure",
      "Multiple-target engagements at varying distances",
      "Stress-based drills that combine movement and precision",
      "Diagnosing and correcting performance gaps in real time",
      "Scope Carbine II is intended for shooters who have completed Scope Carbine I or have equivalent experience and are ready to apply their fundamentals in a more demanding environment.",
    ],
    requirements: [
      "Scoped rifle (confirmed zero)",
      "400 rounds of rifle ammunition",
      "Rifle sling",
      "At least 3 rifle magazines",
      "Bipod and shooting bag",
      "Belt / Chest Rig",
      "Magazine holders for rifle magazines",
      "Ear & Eye Protection",
      "Permanent Marker & notebook",
      "Appropriate clothing for terrain and weather",
      "Weapons maintenance & cleaning equipment",
      "Food & Water",
    ],
    rentalNote: RENTAL_NOTE,
  },
];

// CPR is rendered separately (its own section) but uses the same data shape.
export const CPR_COURSE: Course = {
  courseKey: "cpr-aed-firstaid",
  title: "CPR / AED / First Aid",
  image: cprFlyer,
  fallbackPrice: "$90",
  fallbackLevel: "All Levels",
  fallbackTime: "3.5 hrs",
  fallbackLocation: "Location TBA",
  description:
    "At CGS, we believe being prepared goes beyond the range. While firearm training is critical, the reality is you are far more likely to encounter a medical emergency than a defensive shooting.",
  details: [
    "Our American Red Cross CPR, AED, and First Aid course is designed to give you the knowledge and confidence to act when it matters most. From cardiac arrest to severe bleeding and everyday injuries, this training equips you with practical, life-saving skills that can make the difference before emergency services arrive.",
    "Built on the same standards as our firearms instruction, this course emphasizes a safety-first mindset, real-world application, and a relentless commitment to mastering the fundamentals.",
    "Because being truly prepared means more than carrying a firearm. It means being ready to save a life.",
  ],
  requirements: [],
};

// Display order + labels for grouping classes by course on the admin page.
// Mirrors COURSE_CATALOG plus the CPR row, in the order admins want to see them.
export const COURSE_GROUPS: { key: CourseKey; label: string }[] = [
  { key: "pistol-performance", label: "Pistol Performance" },
  { key: "pistol-performance-2", label: "Pistol Performance II" },
  { key: "baseline-pistol", label: "Baseline Pistol Course" },
  { key: "defensive-dynamic", label: "Defensive Dynamic Performance" },
  { key: "scope-carbine-1", label: "American Rifleman I" },
  { key: "scope-carbine-2", label: "American Rifleman II" },
  { key: "cpr-aed-firstaid", label: "CPR / AED / First Aid" },
];
