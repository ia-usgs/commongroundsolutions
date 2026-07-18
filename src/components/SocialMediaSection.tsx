import { Instagram } from "lucide-react";

const SocialMediaSection = () => {
  return (
    <section id="social" className="py-24 bg-background text-foreground relative border-t border-border">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-foreground">
            Connect With Us
          </h2>
          <p className="text-foreground/80 text-lg sm:text-xl">
            Follow <span className="text-primary font-semibold">@cgstraininggroup</span> on Instagram for daily training updates, student highlights, and behind-the-scenes content on the range.
          </p>
        </div>

        {/* Action Button */}
        <a 
          href="https://www.instagram.com/cgstraininggroup?igsh=NTc4MTIwNjQ2YQ==" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-16 rounded-sm bg-primary px-8 py-4 font-heading font-semibold tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
        >
          <Instagram size={20} />
          FOLLOW ON INSTAGRAM
        </a>

        {/* Embedded Feed */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center relative">
          <div className="w-full bg-secondary/20 rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src="https://www.instagram.com/cgstraininggroup/embed"
              className="w-full min-h-[400px] md:min-h-[600px]"
              allowTransparency={true}
              allow="encrypted-media"
              title="Instagram Feed"
            />
          </div>
          
          <p className="mt-8 text-foreground/60 text-sm">
            Can't see the feed?{" "}
            <a
              href="https://www.instagram.com/cgstraininggroup?igsh=NTc4MTIwNjQ2YQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Visit us directly on Instagram
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default SocialMediaSection;
