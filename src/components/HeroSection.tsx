import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/30" />

      {/* Spacer for navbar */}
      <div className="pt-20" />

      {/* Content centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        {/* intentionally empty — logo is in navbar */}
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 pb-16 px-6">
        <p className="text-2xl md:text-4xl lg:text-5xl font-heading tracking-[0.15em] text-primary animate-fade-in-up">
          SPEED &nbsp;•&nbsp; ACCURACY &nbsp;•&nbsp; CONSISTENCY
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
