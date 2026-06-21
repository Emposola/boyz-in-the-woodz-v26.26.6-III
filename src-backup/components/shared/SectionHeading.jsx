/* ============================================================
   SECTION HEADING — Reusable heading with optional subtitle
   Used throughout the site for consistent section titling
   ============================================================ */
import React from 'react';

export default function SectionHeading({ title, subtitle, align = 'center', className = '' }) {
  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <div className={`${alignClass} ${className}`}>
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}