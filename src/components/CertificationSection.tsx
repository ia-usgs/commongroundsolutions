import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useClassesAndSeats } from "@/features/classes/hooks/useClassesAndSeats";
import { CPR_COURSE } from "@/features/courses/data/courseCatalog";
import { useCourseOverrides, mergeCourse } from "@/features/courses/hooks/useCourseDescriptions";
import { CourseMetaTabs } from "@/features/courses/components/CourseMetaTabs";
import { isCourseComingSoon, pickPreferredSlug } from "@/features/courses/lib/selection";
import { SignupModal } from "@/features/signups/components/SignupModal";
import { formatPrice, formatTimeRange } from "@/lib/format";

const CertificationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [modalState, setModalState] = useState<{
    open: boolean;
    classId: string | null;
    className: string;
    price: string;
    priceCents: number;
  }>({ open: false, classId: null, className: "", price: "", priceCents: 0 });

  const { getRemaining, getClassBySlug, getClassesByCourseKey } = useClassesAndSeats();
  const overrides = useCourseOverrides();
  const course = mergeCourse(CPR_COURSE, overrides[CPR_COURSE.courseKey]);
  const instances = getClassesByCourseKey(course.courseKey);

  const activeSlug = pickPreferredSlug(
    instances,
    (slug) => getRemaining(slug)?.full ?? false,
    selectedSlug
  );
  const activeInstance = activeSlug ? instances.find((i) => i.slug === activeSlug) : undefined;
  const seatInfo = activeSlug ? getRemaining(activeSlug) : null;
  const comingSoon = isCourseComingSoon(instances);

  const displayPrice = activeInstance
    ? formatPrice(activeInstance.price_cents, CPR_COURSE.fallbackPrice)
    : CPR_COURSE.fallbackPrice;
  const displayTime = formatTimeRange(
    activeInstance?.start_time,
    activeInstance?.end_time,
    CPR_COURSE.fallbackTime ?? "TBA"
  );
  const displayLocation = activeInstance?.location ?? CPR_COURSE.fallbackLocation ?? "Location TBA";

  const openSignup = () => {
    if (!activeSlug) return;
    const cls = getClassBySlug(activeSlug);
    if (!cls) return;
    setModalState({
      open: true,
      classId: cls.id,
      className: CPR_COURSE.title,
      price: displayPrice,
      priceCents: cls.price_cents ?? 0,
    });
  };

  return (
    <section id="certification" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          {CPR_COURSE.title}
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Click below to learn more and reserve your spot.
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all">
            <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
              <div className="relative h-64 overflow-hidden">
                <img
                  src={CPR_COURSE.image}
                  alt="American Red Cross CPR / AED / First Aid Certified Training Available"
                  className="w-full h-full object-cover bg-card group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />

              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-heading font-semibold text-foreground">
                    {CPR_COURSE.title}
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="text-primary" size={24} />
                  ) : (
                    <ChevronDown className="text-primary" size={24} />
                  )}
                </div>
                <CourseMetaTabs
                  instances={instances}
                  activeSlug={activeSlug}
                  activeInstance={activeInstance}
                  onSelectSlug={setSelectedSlug}
                  getRemaining={getRemaining}
                  displayTime={displayTime}
                  displayPrice={displayPrice}
                  displayLocation={displayLocation}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-6 animate-fade-in-up">
                <p className="text-foreground/80 leading-relaxed">{cprDescription}</p>
                {CPR_COURSE.details.map((p, i) => (
                  <p key={i} className="text-foreground/80 leading-relaxed">
                    {p}
                  </p>
                ))}

                {comingSoon ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = `contact?reserve=${CPR_COURSE.courseKey}`;
                      setTimeout(() => {
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }, 0);
                    }}
                    className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase mt-2"
                  >
                    Reserve Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openSignup}
                    disabled={seatInfo?.full}
                    className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/80 transition-colors uppercase mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {seatInfo?.full ? "Class Full" : "Reserve Now"}
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
        priceCents={modalState.priceCents}
      />
    </section>
  );
};

export default CertificationSection;
