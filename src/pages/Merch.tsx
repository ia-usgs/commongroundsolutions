import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MerchGrid } from "@/features/merch/components/MerchGrid";
import { PAYMENTS } from "@/config/payments";
import { SHIPPING_CENTS } from "@/features/merch/constants";
import { formatCents } from "@/features/signups/discounts";

const TITLE = "CGS Merch | Common Ground Solutions Apparel";
const DESCRIPTION =
  "Shop Common Ground Solutions tees. Pre-order CGS apparel in sizes S-3XL, pick up in person or ship for $7. Pay by Zelle or Venmo.";

const Merch = () => {
  useEffect(() => {
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", DESCRIPTION);
    return () => {
      if (previous !== null) meta?.setAttribute("content", previous);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 sm:pt-32 sm:pb-24">
        <header className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="font-heading text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-3">
            Common Ground Solutions
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl uppercase tracking-widest text-foreground">
            Merch
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Pre-order CGS apparel. Pick up in person at a class or have it shipped for{" "}
            {formatCents(SHIPPING_CENTS)}. Payment is by Zelle ({PAYMENTS.zelle.name}) or Venmo (
            {PAYMENTS.venmo.handle}) after you place your order.
          </p>
        </header>

        <MerchGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Merch;
