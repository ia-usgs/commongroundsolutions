import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";
import cprFlyer from "@/assets/cpr-certification.png";

const CertificationSection = () => {
  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-12">
          CPR / AED / First Aid
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Flyer */}
          <a
            href="#contact"
            className="block w-full overflow-hidden border border-border hover:border-primary/50 transition-all hover:scale-[1.02] duration-300"
          >
            <img
              src={cprFlyer}
              alt="American Red Cross CPR / AED / First Aid Certified Training Available"
              className="w-full h-auto"
            />
          </a>

          {/* Copy */}
          <div className="space-y-5">
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

            <div className="flex flex-wrap gap-3 text-xs font-heading tracking-wider pt-2">
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

            <a
              href="#contact"
              className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase mt-4"
            >
              Reserve Your Spot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
