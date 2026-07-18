import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-background"
        style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: "center 25%" }}
      />
      {/* Dark overlay - lighter so more of the image shows */}
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground animate-fade-in-up">
          Common Ground Solutions
        </h1>
        <p className="mt-2 text-lg md:text-3xl font-heading tracking-widest text-foreground/90 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Training Academy
        </p>
        <p className="mt-4 text-sm sm:text-lg md:text-2xl font-heading tracking-[0.2em] md:tracking-[0.3em] text-primary animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          Critical Thinking • Marksmanship • Readiness
        </p>
        <a
          href="#classes"
          className="mt-8 md:mt-10 font-heading text-sm tracking-widest bg-primary text-primary-foreground px-6 py-3 md:px-8 hover:bg-primary/80 transition-all uppercase animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          View Courses
        </a>
      </div>

      {/* Scroll indicator */}
      <a href="#mission" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-foreground/50">
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default HeroSection;
