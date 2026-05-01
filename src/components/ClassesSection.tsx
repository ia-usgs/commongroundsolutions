import { useState } from "react";
import { Calendar, Clock, DollarSign, ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";
import classPistol from "@/assets/class-pistol.jpg";
import classPistolFundamental from "@/assets/class-pistol-fundamental.jpg";
import classRifleFundamental from "@/assets/rifle-fundamental.png";
import classCarbine from "@/assets/class-scoped-carbine.jpg";
import classCarbine1 from "@/assets/class-scoped-carbine-1.jpg";
import classDefensive from "@/assets/class-defensive.jpg";
import SignupModal from "./SignupModal";
import { useClassesAndSeats } from "@/hooks/useSeatCounts";

const courses = [
  {
    title: "Pistol Performance",
    image: classPistol,
    dates: [
      { label: "May 2nd", soldOut: true, slug: "pistol-performance-may-2" },
      { label: "May 23rd", soldOut: false, slug: "pistol-performance-may-23" },
    ],
    time: "0730–1330",
    price: "$225",
    level: "All Levels",
    location: "Nuevo, CA",
    comingSoon: false,
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
    rentalNote:
      "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.",
  },
  {
    title: "Baseline Pistol Course",
    image: classPistolFundamental,
    date: "May 24th",
    slug: "baseline-pistol-may-24",
    time: "0730–1330",
    price: "$180",
    level: "All Levels",
    location: "Nuevo, CA",
    comingSoon: false,
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
    rentalNote:
      "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.",
  },
  {
    title: "Defensive Dynamic Performance",
    image: classDefensive,
    date: "TBA",
    slug: "defensive-dynamic-tba",
    time: "0730–1430",
    price: "$265",
    level: "Intermediate",
    location: "Nuevo, CA",
    comingSoon: false,
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
    rentalNote:
      "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.",
  },
  {
    title: "Baseline Rifle",
    image: classRifleFundamental,
    date: "TBA",
    slug: "baseline-rifle-tba",
    time: "0730–1330",
    price: "$225",
    level: "All Levels",
    location: "Nuevo, CA",
    comingSoon: false,
    description:
      "The Baseline Rifle Course is built to develop shooters who understand why they perform the way they do—not just how to send rounds downrange. Whether you're new to the rifle platform or looking to refine your performance, this course focuses on building a dependable foundation that holds up under pressure.",
    details: [
      "At CGS, we don't chase gimmicks or trends. We focus on the fundamentals that actually drive performance—then teach you how to diagnose and correct your own shooting.",
      "In this course, you'll develop:",
      "A strong foundation in rifle marksmanship principles",
      "The ability to isolate and correct fundamental errors",
      "Working knowledge of rifle conditions and cycle of operations",
      "Efficient shooting positions for stability and control",
      "Understanding of mechanical offset and practical application",
      "Immediate and remedial action for common malfunctions",
      "Optic setup considerations and back-up sight integration",
      "Strong-side and support-side shooting capability",
      "Effective reloads and weapon manipulations",
      "Sling use for control, support, and transitions",
      "Movement techniques during engagements",
      "Shooting from cover and positional awareness",
      "Engagement techniques for close to mid-range distances",
      "This course is designed to give you a repeatable process—so you're not relying on luck or guesswork. You'll leave with the tools to train with purpose, track your progress, and continue improving long after the course ends.",
    ],
    requirements: [
      "Rifle",
      "500 rounds of rifle ammunition",
      "Rifle sling",
      "At least 3 rifle magazines",
      "Belt / Chest Rig",
      "At least 1 magazine holder for rifle magazines",
      "Ear & Eye Protection",
      "Permanent Marker",
      "Appropriate clothing for terrain and weather",
      "Weapons maintenance & cleaning equipment",
      "Food & Water",
    ],
    rentalNote:
      "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.",
  },
  {
    title: "Scope Carbine I",
    image: classCarbine1,
    date: "TBA",
    slug: "scope-carbine-1-tba",
    time: "0730–1330",
    price: "$350",
    level: "Intermediate",
    location: "Nuevo, CA",
    comingSoon: true,
    description: "Introductory scoped carbine course covering precision shooting fundamentals, scope zeroing, and positional shooting techniques. 6 spots available.",
  },
  {
    title: "Scope Carbine II",
    image: classCarbine,
    date: "TBA",
    slug: "scope-carbine-2-tba",
    time: "0730–1330",
    price: "$375",
    level: "Intermediate",
    location: "Nuevo, CA",
    comingSoon: true,
    description: "Advanced scoped carbine course building on Scope Carbine I with extended distance engagements and advanced positional work. 6 spots available.",
  },
];

const ClassesSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<{
    open: boolean;
    classId: string | null;
    className: string;
    price: string;
  }>({ open: false, classId: null, className: "", price: "" });
  const { getRemaining, getClassBySlug } = useClassesAndSeats();

  const resolveSlug = (course: any): string | undefined => {
    if (course.dates) {
      return selectedSlugs[course.title] ?? course.dates.find((d: any) => !d.soldOut)?.slug ?? course.dates[0].slug;
    }
    return course.slug;
  };

  const openSignup = (course: any) => {
    const slug = resolveSlug(course);
    if (!slug) return;
    const cls = getClassBySlug(slug);
    if (!cls) return;
    setModalState({
      open: true,
      classId: cls.id,
      className: course.title,
      price: course.price,
    });
  };

  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          Our Courses
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click on a course below to learn more and sign up. Classes are added frequently. Check back for updated schedules.
        </p>

        <div className="max-w-3xl mx-auto space-y-8">
          {courses.map((course) => {
            const isExpanded = expanded === course.title;
            const activeSlug = resolveSlug(course);
            const seatInfo = activeSlug ? getRemaining(activeSlug) : null;
            return (
              <div
                key={course.title}
                className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all"
              >
                <div
                  className={course.comingSoon ? "" : "cursor-pointer"}
                  onClick={() => !course.comingSoon && setExpanded(isExpanded ? null : course.title)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover bg-card group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
                    {course.comingSoon && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                        <span className="font-heading text-2xl tracking-widest text-primary uppercase">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-heading font-semibold text-foreground">
                        {course.title}
                      </h3>
                      {!course.comingSoon && (
                        isExpanded ? (
                          <ChevronUp className="text-primary" size={24} />
                        ) : (
                          <ChevronDown className="text-primary" size={24} />
                        )
                      )}
                    </div>
                    {!course.comingSoon && (
                      <div className="flex flex-wrap gap-3 text-xs font-heading tracking-wider">
                        {course.dates ? (
                          <span
                            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Calendar size={14} />
                            <select
                              className="bg-transparent text-primary font-heading tracking-wider text-xs focus:outline-none cursor-pointer"
                              value={
                                selectedSlugs[course.title] ??
                                course.dates.find((d: any) => !d.soldOut)?.slug ??
                                course.dates[0].slug
                              }
                              onChange={(e) =>
                                setSelectedSlugs({ ...selectedSlugs, [course.title]: e.target.value })
                              }
                            >
                              {course.dates.map((d: any) => (
                                <option key={d.slug} value={d.slug} disabled={d.soldOut} className="bg-card text-foreground">
                                  {d.label}{d.soldOut ? " — Sold Out" : ""}
                                </option>
                              ))}
                            </select>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                            <Calendar size={14} /> {course.date}
                          </span>
                        )}
                        <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                          <Clock size={14} /> {course.time}
                        </span>
                        <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                          <DollarSign size={14} /> {course.price}
                        </span>
                        <span className="bg-secondary text-secondary-foreground px-3 py-1">
                          {course.level}
                        </span>
                        {course.location && (
                          <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                            <MapPin size={14} /> {course.location}
                          </span>
                        )}
                        {seatInfo && (
                          <span
                            className={`flex items-center gap-1 px-3 py-1 ${
                              seatInfo.full
                                ? "bg-destructive/20 text-destructive"
                                : seatInfo.remaining <= 3
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <Users size={14} />
                            {seatInfo.full ? "Class Full" : `${seatInfo.remaining} of ${seatInfo.capacity} left`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isExpanded && !course.comingSoon && (
                  <div className="px-6 pb-6 space-y-6 border-t border-border pt-6 animate-fade-in-up">
                    <p className="text-foreground/80 leading-relaxed">
                      {course.description}
                    </p>
                    {course.details && (
                      <>
                        {course.details.slice(0, 2).map((detail, i) => (
                          <p key={i} className="text-foreground/80 leading-relaxed">
                            {detail}
                          </p>
                        ))}
                        <ul className="space-y-2">
                          {course.details.slice(2, -1).map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80">
                              <span className="text-primary mt-1">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                        <p className="text-foreground/80 leading-relaxed">
                          {course.details[course.details.length - 1]}
                        </p>
                      </>
                    )}

                    <div>
                      <h4 className="font-heading text-lg font-semibold text-foreground mb-3">
                        What Students Should Bring to Class
                      </h4>
                      <ul className="space-y-2">
                        {course.requirements?.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-foreground/80">
                            <span className="text-primary mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-muted-foreground text-sm italic">
                        {course.rentalNote}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openSignup(course)}
                      disabled={seatInfo?.full}
                      className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {seatInfo?.full ? "Class Full" : "Sign Up Now"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <SignupModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        classId={modalState.classId}
        className={modalState.className}
        price={modalState.price}
      />
    </section>
  );
};

export default ClassesSection;
