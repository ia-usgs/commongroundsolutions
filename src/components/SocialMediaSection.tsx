import { Instagram, Camera } from "lucide-react";

const SocialMediaSection = () => {
  return (
    <section id="social" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Optional subtle background pattern (hex/honeycomb placeholder effect) */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#00ffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-zinc-900/50 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-400 mb-6 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
          <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
          CONNECT WITH US
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-wide">
          <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Social </span>
          <span className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Media</span>
        </h2>
        
        <p className="max-w-2xl text-zinc-400 text-lg mb-16">
          Follow us on Instagram for the latest classes, training tips, and behind-the-scenes content.
        </p>

        {/* Profile Block */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-900 border border-cyan-500/20 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Camera className="text-zinc-400" size={32} />
          </div>
          
          <h3 className="text-xl md:text-3xl font-heading font-medium tracking-widest mb-3">
            <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">@</span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              cgstraininggroup
            </span>
          </h3>
          
          <p className="text-zinc-500 mb-8 max-w-lg">
            Training updates, student highlights, range days, and more — see our work in action.
          </p>
          
          <a 
            href="https://www.instagram.com/cgstraininggroup?igsh=NTc4MTIwNjQ2YQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-8 py-3 font-semibold text-zinc-950 transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
          >
            <Instagram size={20} />
            Follow on Instagram
          </a>
        </div>

        {/* Separator / Posts Header */}
        <div className="w-full max-w-4xl border-t border-zinc-800 pt-12 mb-8">
          <h4 className="text-xl md:text-2xl font-heading font-semibold tracking-wider mb-8">
            <span className="text-white">Latest </span>
            <span className="text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]">Posts</span>
          </h4>
          
          {/* Embedded Feed */}
          <div className="bg-white/5 rounded-xl border border-zinc-800 p-6 w-full max-w-xl mx-auto flex flex-col items-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-center w-full">
              <iframe
                src={`https://www.instagram.com/cgstraininggroup/embed`}
                className="w-full max-w-lg rounded-xl border-0"
                style={{ minHeight: 600 }}
                allowTransparency={true}
                allow="encrypted-media"
                title="Instagram Feed"
              />
            </div>
            
            <p className="mt-6 text-zinc-500 text-sm font-mono text-center">
              Can't see the feed?{" "}
              <a
                href="https://www.instagram.com/cgstraininggroup?igsh=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Visit us directly on Instagram
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SocialMediaSection;
