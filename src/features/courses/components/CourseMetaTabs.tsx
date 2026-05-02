// Renders the row of meta "tabs" (date, time, price, level, location, seat count) shown
// on each course card. Used by both ClassesSection and CertificationSection.
import { Calendar, Clock, DollarSign, MapPin, Users } from "lucide-react";
import { formatDateLabel, FAR_FUTURE_DATE } from "@/lib/format";
import type { ClassRow } from "@/features/classes/types";

export type CourseMetaTabsProps = {
  instances: ClassRow[];
  activeSlug: string | undefined;
  activeInstance: ClassRow | undefined;
  onSelectSlug: (slug: string) => void;
  getRemaining: (slug: string) => { remaining: number; capacity: number; full: boolean } | null;
  displayTime: string;
  displayPrice: string;
  displayLocation: string;
  displayLevel?: string;
};

export const CourseMetaTabs = ({
  instances,
  activeSlug,
  activeInstance,
  onSelectSlug,
  getRemaining,
  displayTime,
  displayPrice,
  displayLocation,
  displayLevel,
}: CourseMetaTabsProps) => {
  const seatInfo = activeSlug ? getRemaining(activeSlug) : null;

  return (
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
            onChange={(e) => onSelectSlug(e.target.value)}
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
      {displayLevel && (
        <span className="bg-secondary text-secondary-foreground px-3 py-1">
          {displayLevel}
        </span>
      )}
      <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1">
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
  );
};
