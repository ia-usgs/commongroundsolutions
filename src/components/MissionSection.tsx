import { Shield, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every course emphasizes safe handling, situational awareness, and responsible firearm ownership.",
  },
  {
    icon: Users,
    title: "All Skill Levels",
    description: "From first-time shooters to seasoned operators, our courses are tailored to challenge and develop every student.",
  },
];

const MissionSection = () => {
  return (
    <section id="mission" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-6">
          Our Mission
        </h2>
        <div className="max-w-3xl mx-auto text-center text-foreground/80 text-lg leading-relaxed mb-16 space-y-4">
          <p>
            At Common Ground Solution our mission is to provide safe, effective, and responsible firearm training for individuals at every level, whether new to shooting or experienced and looking to refine their skills.
          </p>
          <p>
            Our instruction is built on real-world experience and a relentless commitment to mastering the fundamentals. We emphasize safety, accountability, and practical application in a structured, no-nonsense environment designed for everyday civilians.
          </p>
          <p>
            Led by instructors who are both NRA-certified and P.O.S.T.-certified, we uphold a high standard of training grounded in proven methodology and professional discipline.
          </p>
          <p>
            Our goal is simple: to help responsible citizens build confidence, sharpen their abilities, and carry themselves with the awareness and responsibility that firearm ownership demands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border p-6 md:p-8 text-center group hover:border-primary/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
