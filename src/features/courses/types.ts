// Domain types for course catalog content (static, code-defined) and class instances (DB-backed).
// A "Course" is the marketing/curriculum content. A "Class" is a scheduled instance of a course.

export type CourseKey =
  | "pistol-performance"
  | "pistol-performance-2"
  | "baseline-pistol"
  | "defensive-dynamic"
  | "defensive-pistol-tacmed"
  | "scope-carbine-1"
  | "scope-carbine-2"
  | "cpr-aed-firstaid"
  | "pcsl-nationals-prep"
  | "cloak-and-dagger";


export type Course = {
  courseKey: CourseKey;
  title: string;
  image: string;
  /** Tailwind object-fit class for the card image. */
  imageFit?: "object-cover" | "object-contain";
  /** Optional narrower picture shown on phone-width cards so nothing important is cropped. */
  imageMobile?: string;
  fallbackPrice: string;
  fallbackLevel: string;
  fallbackTime?: string;
  fallbackLocation?: string;
  /** When true, the course is shown as "Coming Soon" regardless of DB instances. */
  forceComingSoon?: boolean;
  /** When true, promo codes and returning-customer discounts are not offered for this course. */
  discountsDisabled?: boolean;
  description: string;
  /** First two entries render as paragraphs, middle entries render as bullets, last entry renders as a closing paragraph. */
  details: string[];
  requirements: string[];
  rentalNote?: string;
};
