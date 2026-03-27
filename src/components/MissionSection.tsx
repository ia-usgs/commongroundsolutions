import { Shield, Target, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Expert Instruction",
    description: "Our instructors bring years of military and law enforcement experience to deliver world-class firearms training.",
  },
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
    <section id="mission" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-6">
          Our Mission
        </h2>
        <p className="max-w-3xl mx-auto text-center text-foreground/80 text-lg leading-relaxed mb-16">
          Common Ground Solution delivers elite firearms instruction designed to build a knowledge-based understanding of core shooting fundamentals. We teach advanced techniques that shooters of all levels can adapt to — both on the square range and under the high stress of a life-threatening situation. Our students leave safer, more efficient, and ready to protect what matters.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
