import logoShort from "@/assets/logo-short.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Lighter overlay to let photo show through */}
      <div className="absolute inset-0 bg-background/30" />

      {/* Centered logo */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-20">
        <img
          src={logoShort}
          alt="Common Ground Solutions"
          className="w-40 md:w-56 lg:w-64 animate-fade-in drop-shadow-2xl"
        />
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
