import { useState } from "react";
import { Calendar, Clock, DollarSign, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import cprFlyer from "@/assets/cpr-certification.png";

const CertificationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          CPR / AED / First Aid
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click below to learn more and reserve your spot.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all">
            <div
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cprFlyer}
                  alt="American Red Cross CPR / AED / First Aid Certified Training Available"
                  className="w-full h-full object-cover bg-card group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-heading font-semibold text-foreground">
                    CPR / AED / First Aid
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="text-primary" size={24} />
                  ) : (
                    <ChevronDown className="text-primary" size={24} />
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-heading tracking-wider">
                  <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                    <DollarSign size={14} /> $90
                  </span>
                  <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                    <Clock size={14} /> 3.5 hrs
                  </span>
                  <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                    <Calendar size={14} /> Reservation Required
                  </span>
                  <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                    <MapPin size={14} /> Location TBA
                  </span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-6 animate-fade-in-up">
                <p className="text-foreground/80 leading-relaxed">
                  At CGS, we believe being prepared goes beyond the range. While firearm training is critical, the reality is you are far more likely to encounter a medical emergency than a defensive shooting.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Our American Red Cross CPR, AED, and First Aid course is designed to give you the knowledge and confidence to act when it matters most. From cardiac arrest to severe bleeding and everyday injuries, this training equips you with practical, life-saving skills that can make the difference before emergency services arrive.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Built on the same standards as our firearms instruction, this course emphasizes a safety-first mindset, real-world application, and a relentless commitment to mastering the fundamentals.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Because being truly prepared means more than carrying a firearm. It means being ready to save a life.
                </p>

                <a
                  href="#contact"
                  className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase mt-2"
                >
                  Reserve Your Spot
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
