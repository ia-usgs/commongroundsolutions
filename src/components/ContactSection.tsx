import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sending to Web3Forms Free API layer
      // Please replace "YOUR_ACCESS_KEY_HERE" with your free key from https://web3forms.com
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c13f5d4f-ebc9-4707-8d94-c0466561bde8",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          subject: `New Website Inquiry from ${formData.name}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent! We'll be in touch shortly.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not reach the server. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <MapPin className="text-primary shrink-0" size={20} />
                <span>Southern California</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            />
            <input
              type="email"
              placeholder="Email Address *"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            />
            <textarea
              rows={4}
              placeholder="Message *"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
