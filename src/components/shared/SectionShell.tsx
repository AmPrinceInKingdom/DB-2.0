import type { ReactNode } from "react";

/**
 * Reusable section wrapper for storefront sections.
 * This keeps spacing and section headers consistent across the site.
 */
export default function SectionShell({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`db-container py-8 md:py-10 ${className}`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="db-section-title">{title}</h2>
          {subtitle ? <p className="db-section-subtitle">{subtitle}</p> : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {children}
    </section>
  );
}