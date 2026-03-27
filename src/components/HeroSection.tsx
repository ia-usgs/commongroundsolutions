import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <img
          src={logo}
          alt="Common Ground Solutions"
          className="w-72 md:w-96 lg:w-[500px] mb-8 animate-fade-in"
        />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground animate-fade-in-up">
          Common Ground Solutions
        </h1>
        <p className="mt-4 text-lg md:text-2xl font-heading tracking-[0.3em] text-primary animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Discipline • Precision • Readiness
        </p>
        <a
          href="#classes"
          className="mt-10 font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-all uppercase animate-fade-in-up"
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
