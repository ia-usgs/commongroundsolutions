import classPistol from "@/assets/class-pistol.jpg";
import classCarbine from "@/assets/class-carbine.jpg";
import classDefensive from "@/assets/class-defensive.jpg";

const courses = [
  {
    title: "Fundamental Pistol",
    image: classPistol,
    schedule: "Weekends",
    duration: "1 Day Course",
    level: "Open Enrollment",
    description: "Master the core fundamentals of pistol shooting including grip, stance, sight alignment, and trigger control.",
  },
  {
    title: "Tactical Carbine",
    image: classCarbine,
    schedule: "Saturdays",
    duration: "1 Day Course",
    level: "Open Enrollment",
    description: "Learn carbine manipulation, shooting positions, transitions, and dynamic movement with your rifle.",
  },
  {
    title: "Defensive Concealed Carry",
    image: classDefensive,
    schedule: "Sundays",
    duration: "1 Day Course",
    level: "Prerequisites Required",
    description: "Advanced concealed carry techniques, draw from concealment, threat assessment, and defensive scenarios.",
  },
];

const ClassesSection = () => {
  return (
    <section id="classes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          Our Courses
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click on a course below to learn more. Classes are added frequently — check back for updated schedules.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-2 text-xs font-heading tracking-wider">
                  <span className="bg-primary/10 text-primary px-3 py-1">{course.schedule}</span>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1">{course.duration}</span>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1">{course.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase"
          >
            Book a Private Lesson
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
