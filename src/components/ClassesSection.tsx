import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useClassesAndSeats } from "@/features/classes/hooks/useClassesAndSeats";
import { COURSE_CATALOG } from "@/features/courses/data/courseCatalog";
import { useCourseOverrides, mergeCourse } from "@/features/courses/hooks/useCourseDescriptions";
import { CourseMetaTabs } from "@/features/courses/components/CourseMetaTabs";
import { CourseDetailsBlock } from "@/features/courses/components/CourseDetailsBlock";
import { isCourseComingSoon, pickPreferredSlug } from "@/features/courses/lib/selection";
import { SignupModal } from "@/features/signups/components/SignupModal";
import { formatPrice, formatTimeRange } from "@/lib/format";

const ClassesSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<{
    open: boolean;
    classId: string | null;
    className: string;
    price: string;
    priceCents: number;
    courseKey: string | null;
  }>({ open: false, classId: null, className: "", price: "", priceCents: 0, courseKey: null });

  const { getRemaining, getClassBySlug, getClassesByCourseKey } = useClassesAndSeats();
  const overrides = useCourseOverrides();

  return (
    <section id="classes" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-center text-primary mb-4">
          Our Courses
        </h2>
        <p className="text-center text-muted-foreground mb-10 md:mb-16 max-w-2xl mx-auto">
          Click on a course below to learn more and sign up. Classes are added frequently. Check back for updated schedules.
        </p>

        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {COURSE_CATALOG.map((baseCourse) => {
            const course = mergeCourse(baseCourse, overrides[baseCourse.courseKey]);
            const isExpanded = expanded === course.courseKey;
            const instances = getClassesByCourseKey(course.courseKey);
            const activeSlug = pickPreferredSlug(
              instances,
              (slug) => getRemaining(slug)?.full ?? false,
              selectedSlugs[course.courseKey]
            );
            const activeInstance = activeSlug ? instances.find((i) => i.slug === activeSlug) : undefined;
            const seatInfo = activeSlug ? getRemaining(activeSlug) : null;
            const comingSoon = isCourseComingSoon(instances, course.forceComingSoon);

            const displayPrice = activeInstance
              ? formatPrice(activeInstance.price_cents, course.fallbackPrice)
              : course.fallbackPrice;
            const displayTime = formatTimeRange(
              activeInstance?.start_time,
              activeInstance?.end_time,
              "0730–1330"
            );
            const displayLocation = activeInstance?.location ?? "Nuevo, CA";
            const displayLevel = activeInstance?.name?.match(/intermediate/i)
              ? "Intermediate"
              : course.fallbackLevel;

            const onSignupClick = () => {
              if (!activeSlug) return;
              const cls = getClassBySlug(activeSlug);
              if (!cls) return;
              setModalState({
                open: true,
                classId: cls.id,
                className: course.title,
                price: displayPrice,
                priceCents: cls.price_cents ?? 0,
                courseKey: course.courseKey,
              });
            };

            return (
              <div
                key={course.courseKey}
                className="bg-card border border-border overflow-hidden group hover:border-primary/50 transition-all"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : course.courseKey)}
                >
                  <div className={cn(
                    "relative h-48 sm:h-56 md:h-64 overflow-hidden",
                    course.imageFit === "object-contain" && "bg-black"
                  )}>
                    <img
                      src={course.image}
                      alt={course.title}
                      className={cn(
                        "w-full h-full group-hover:scale-105 transition-transform duration-500",
                        course.imageFit === "object-contain" ? "object-contain" : "object-cover"
                      )}
                    />
                    <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors" />

                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                        {course.title}
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
                      onSelectSlug={(slug) =>
                        setSelectedSlugs({ ...selectedSlugs, [course.courseKey]: slug })
                      }
                      getRemaining={getRemaining}
                      displayTime={displayTime}
                      displayPrice={displayPrice}
                      displayLocation={displayLocation}
                      displayLevel={displayLevel}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4 md:space-y-6 border-t border-border pt-4 md:pt-6 animate-fade-in-up">
                    <CourseDetailsBlock course={course} />
                    {comingSoon ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = `contact?reserve=${course.courseKey}`;
                          setTimeout(() => {
                            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                          }, 0);
                        }}
                        className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-6 py-3 md:px-8 hover:bg-primary/80 transition-colors uppercase"
                      >
                        Reserve Your Spot
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onSignupClick}
                        disabled={seatInfo?.full || activeInstance?.status === "sold_out"}
                        className="inline-block font-heading text-sm tracking-widest bg-primary text-primary-foreground px-6 py-3 md:px-8 hover:bg-primary/80 transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {seatInfo?.full || activeInstance?.status === "sold_out" ? "Sold Out" : "Sign Up Now"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <SignupModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        classId={modalState.classId}
        className={modalState.className}
        price={modalState.price}
        priceCents={modalState.priceCents}
        courseKey={modalState.courseKey}
      />
    </section>
  );
};

export default ClassesSection;
