import cprFlyer from "@/assets/cpr-certification.png";

const CertificationSection = () => {
  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-12">
          CPR / AED / First Aid
        </h2>
        <a
          href="#contact"
          className="block max-w-lg w-full overflow-hidden border border-border hover:border-primary/50 transition-all hover:scale-[1.02] duration-300"
        >
          <img
            src={cprFlyer}
            alt="American Red Cross CPR / AED / First Aid Certified Training Available"
            className="w-full h-auto"
          />
        </a>
        <p className="mt-6 text-muted-foreground text-center text-sm">
          Click above to sign up for certified training
        </p>
      </div>
    </section>
  );
};

export default CertificationSection;
