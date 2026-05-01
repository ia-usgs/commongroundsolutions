import { useState } from "react";
import { Calendar, Clock, DollarSign, MapPin, ChevronDown, ChevronUp, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import cprFlyer from "@/assets/cpr-certification.png";
import SignupModal from "./SignupModal";
import { useClassesAndSeats } from "@/hooks/useSeatCounts";

const COURSE_KEY = "cpr-aed-firstaid";
const FAR_FUTURE_DATE = "2099-12-31";

const formatDateLabel = (iso: string) => {
  if (!iso || iso === FAR_FUTURE_DATE) return "TBA";
  try {
    return format(parseISO(iso), "MMM d");
  } catch {
    return iso;
  }
};

const CertificationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [modalState, setModalState] = useState<{
    open: boolean;
    classId: string | null;
    className: string;
    price: string;
  }>({ open: false, classId: null, className: "", price: "" });

  const { getRemaining, getClassBySlug, getClassesByCourseKey } = useClassesAndSeats();
  const instances = getClassesByCourseKey(COURSE_KEY);

  const openWithSeats = instances.filter((i) => {
    if (i.status !== "open") return false;
    const seat = getRemaining(i.slug);
    return !seat?.full;
  });
  const open = instances.filter((i) => i.status === "open");
  const preferred = openWithSeats[0] ?? open[0] ?? instances[0];
  const activeSlug = selectedSlug ?? preferred?.slug;
  const activeInstance = activeSlug ? instances.find((i) => i.slug === activeSlug) : undefined;
  const seatInfo = activeSlug ? getRemaining(activeSlug) : null;

  const onlyTba = instances.length > 0 && instances.every((i) => i.status === "tba" || i.status === "closed");
  const comingSoon = instances.length === 0 || onlyTba;

  const displayPrice = activeInstance
    ? `$${(activeInstance.price_cents / 100).toFixed(activeInstance.price_cents % 100 === 0 ? 0 : 2)}`
    : "$90";
  const displayTime = activeInstance && activeInstance.start_time && activeInstance.end_time
    ? `${activeInstance.start_time}–${activeInstance.end_time}`
    : "3.5 hrs";
  const displayLocation = activeInstance?.location ?? "Location TBA";

  const openSignup = () => {
    if (!activeSlug) return;
    const cls = getClassBySlug(activeSlug);
    if (!cls) return;
    setModalState({
      open: true,
      classId: cls.id,
      className: "CPR / AED / First Aid",
      price: displayPrice,
    });
  };

  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          CPR / AED / First Aid
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click below to learn more and reserve your spot.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all">
            <div
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cprFlyer}
                  alt="American Red Cross CPR / AED / First Aid Certified Training Available"
                  className="w-full h-full object-cover bg-card group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />
                {comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                    <span className="font-heading text-2xl tracking-widest text-primary uppercase">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-heading font-semibold text-foreground">
                    CPR / AED / First Aid
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="text-primary" size={24} />
                  ) : (
                    <ChevronDown className="text-primary" size={24} />
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-heading tracking-wider">
                  {instances.length > 1 ? (
                    <span
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar size={14} />
                      <select
                        className="bg-transparent text-primary font-heading tracking-wider text-xs focus:outline-none cursor-pointer"
                        value={activeSlug ?? instances[0].slug}
                        onChange={(e) => setSelectedSlug(e.target.value)}
                      >
                        {instances.map((i) => {
                          const seat = getRemaining(i.slug);
                          const isSoldOut = i.status === "sold_out" || (seat?.full ?? false);
                          const isTba = i.status === "tba" || i.class_date === FAR_FUTURE_DATE;
                          return (
                            <option
                              key={i.slug}
                              value={i.slug}
                              disabled={isSoldOut || i.status === "closed"}
                              className="bg-card text-foreground"
                            >
                              {isTba ? "TBA" : formatDateLabel(i.class_date)}
                              {isSoldOut ? " — Sold Out" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                      <Calendar size={14} /> {activeInstance ? formatDateLabel(activeInstance.class_date) : "TBA"}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                    <Clock size={14} /> {displayTime}
                  </span>
                  <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
                    <DollarSign size={14} /> {displayPrice}
                  </span>
                  <span className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1">
                    <MapPin size={14} /> {displayLocation}
                  </span>
                  {seatInfo && (
                    <span
                      className={`flex items-center gap-1 px-3 py-1 ${
                        seatInfo.full
                          ? "bg-destructive/20 text-destructive"
                          : seatInfo.remaining <= 3
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <Users size={14} />
                      {seatInfo.full ? "Class Full" : `${seatInfo.remaining} of ${seatInfo.capacity} left`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-6 animate-fade-in-up">
                <p className="text-foreground/80 leading-relaxed">
                  At CGS, we believe being prepared goes beyond the range. While firearm training is critical, the reality is you are far more likely to encounter a medical emergency than a defensive shooting.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Our American Red Cross CPR, AED, and First Aid course is designed to give you the knowledge and confidence to act when it matters most. From cardiac arrest to severe bleeding and everyday injuries, this training equips you with practical, life-saving skills that can make the difference before emergency services arrive.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Built on the same standards as our firearms instruction, this course emphasizes a safety-first mindset, real-world application, and a relentless commitment to mastering the fundamentals.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Because being truly prepared means more than carrying a firearm. It means being ready to save a life.
                </p>

                {comingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="inline-block font-heading text-sm tracking-widest bg-secondary text-secondary-foreground px-8 py-3 uppercase opacity-70 cursor-not-allowed mt-2"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openSignup}
                    disabled={seatInfo?.full}
                    className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {seatInfo?.full ? "Class Full" : "Reserve Your Spot"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <SignupModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        classId={modalState.classId}
        className={modalState.className}
        price={modalState.price}
      />
    </section>
  );
};

export default CertificationSection;
