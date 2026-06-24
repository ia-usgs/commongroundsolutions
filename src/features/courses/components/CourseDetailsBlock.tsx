// Renders the expanded details block of a course card: intro paragraphs, bullet list, closing paragraph,
// then the gear/requirements list and rental note.
import type { Course } from "../types";

export const CourseDetailsBlock = ({ course }: { course: Course }) => {
  const details = course.details ?? [];
  const intro = details.slice(0, 2);
  const bullets = details.slice(2, -1);
  const closing = details.length > 2 ? details[details.length - 1] : null;

  return (
    <>
      <p className="text-foreground/80 leading-relaxed">{course.description}</p>
      {intro.map((p, i) => (
        <p key={`intro-${i}`} className="text-foreground/80 leading-relaxed">
          {p}
        </p>
      ))}
      {bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={`b-${i}`} className="flex items-start gap-2 text-foreground/80">
              <span className="text-primary mt-1">•</span>
              {b}
            </li>
          ))}
        </ul>
      )}
      {closing && (
        <p className="text-foreground/80 leading-relaxed">{closing}</p>
      )}
      {course.requirements.length > 0 && (
        <div>
          <h4 className="font-heading text-lg font-semibold text-foreground mb-3">
            What Students Should Bring to Class
          </h4>
          <ul className="space-y-2">
            {course.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-foreground/80">
                <span className="text-primary mt-1">•</span>
                {req}
              </li>
            ))}
          </ul>
          {course.rentalNote && (
            <p className="mt-4 text-muted-foreground text-sm italic">{course.rentalNote}</p>
          )}
        </div>
      )}
    </>
  );
};
