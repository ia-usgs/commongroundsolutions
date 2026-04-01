import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-16">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-8">
            <p className="text-foreground/80 text-lg leading-relaxed">
              Ready to train? Reach out to book a private lesson, ask about group rates, or get more information on upcoming courses.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-foreground/80">
                <Mail className="text-primary shrink-0" size={20} />
                <span>cgstraininggroup@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80">
                <Phone className="text-primary shrink-0" size={20} />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80">
                <MapPin className="text-primary shrink-0" size={20} />
                <span>Southern California</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
