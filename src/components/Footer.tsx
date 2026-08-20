import { Link } from "react-router-dom";
import logoShort from "@/assets/logo-short.png";


const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoShort} alt="Common Ground Solutions" className="h-10 w-auto" />
          <span className="font-heading text-sm tracking-wider text-muted-foreground">
            © {new Date().getFullYear()} Common Ground Solutions
          </span>
        </div>
        <div className="flex gap-6">
          <a href="/#home" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</a>
          <a href="/#mission" className="text-sm text-muted-foreground hover:text-primary transition-colors">Mission</a>
          <a href="/#classes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Classes</a>
          <Link to="/merch" className="text-sm text-muted-foreground hover:text-primary transition-colors">Merch</Link>
          <a href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
