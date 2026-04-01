import { useState } from "react";
import { Calendar, Clock, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import classPistol from "@/assets/class-pistol.jpg";
import classPistolFundamental from "@/assets/class-pistol-fundamental.jpg";
import classCarbine from "@/assets/class-scoped-carbine.jpg";

const courses = [
  {
    title: "Pistol Performance",
    image: classPistol,
    date: "April 25th",
    time: "0730–1330",
    price: "$225",
    level: "All Levels",
    comingSoon: false,
    description:
      "For individuals seeking to develop safe, effective, and responsible firearm skills, our professional instruction is tailored to both new shooters and experienced firearm owners looking to elevate their performance in a structured, safety-focused environment.",
    details: [
      "All courses are led by an instructor who is both NRA-certified and P.O.S.T.-certified, ensuring a high standard of training grounded in proven methodology and professional experience.",
      "Each course emphasizes safety, accountability, and real-world application, while delivering clear, step-by-step coaching to build confidence and competence at every level.",
    ],
    requirements: [
      "Pistol",
      "At least two magazines",
      "Holster (no nylon holsters permitted)",
      "Magazine carriers",
      "Eye and ear protection",
      "Water and snacks",
      "Chair",
      "Cleaning kit",
    ],
    rentalNote:
      "If you do not have the required equipment, firearm and gear rentals are available at the time of booking.",
  },
  {
    title: "Pistol Fundamental",
    image: classPistolFundamental,
    comingSoon: true,
    description: "Foundational pistol course covering safe handling, marksmanship basics, and shooting fundamentals for new and developing shooters.",
  },
  {
    title: "Scoped Carbine",
    image: classCarbine,
    comingSoon: true,
    description: "Advanced scoped carbine course covering precision shooting fundamentals, scope zeroing, and positional shooting techniques.",
  },
];

const ClassesSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          Our Courses
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click on a course below to learn more and sign up. Classes are added frequently — check back for updated schedules.
        </p>

        <div className="max-w-3xl mx-auto space-y-8">
          {courses.map((course) => {
            const isExpanded = expanded === course.title;
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                        <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                          <Calendar size={14} /> {course.date}
                        </span>
                        <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                          <Clock size={14} /> {course.time}
                        </span>
                        <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                          <DollarSign size={14} /> {course.price}
                        </span>
                        <span className="bg-secondary text-secondary-foreground px-3 py-1">
                          {course.level}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {isExpanded && !course.comingSoon && (
                  <div className="px-6 pb-6 space-y-6 border-t border-border pt-6 animate-fade-in-up">
                    <p className="text-foreground/80 leading-relaxed">
                      {course.description}
                    </p>
                    {course.details?.map((detail, i) => (
                      <p key={i} className="text-foreground/80 leading-relaxed">
                        {detail}
                      </p>
                    ))}

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

                    <a
                      href="#contact"
                      className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase"
                    >
                      Sign Up Now
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
