import { Award, Heart, ShieldCheck } from "lucide-react";

const CertificationSection = () => {
  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-6">
          CPR / AED / First Aid
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          American Red Cross certified training available. Be prepared to save a life.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-colors">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">CPR Certification</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn life-saving CPR techniques for adults, children, and infants through the American Red Cross program.
            </p>
          </div>

          <div className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-colors">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">AED Training</h3>
            <p className="text-muted-foreground leading-relaxed">
              Gain confidence using automated external defibrillators in emergency cardiac situations.
            </p>
          </div>

          <div className="bg-card border border-border p-8 text-center group hover:border-primary/50 transition-colors">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">First Aid</h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive first aid training covering wound care, shock management, and emergency response.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase"
          >
            Message for More Info
          </a>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
