// src/components/Shared/Brand.tsx
import React from 'react';

interface BrandProps {
  /** 'lg' = landing page hero. 'sm' = compact icon+text, used in dashboard headers. */
  size?: 'lg' | 'sm';
}

export const Brand: React.FC<BrandProps> = ({ size = 'lg' }) => {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="SportsViewTZ" className="w-6 h-6 rounded-md object-cover border border-[var(--border)]" />
        <span
          className="text-[var(--text-muted)] leading-none"
          style={{ fontFamily: 'var(--font-brand)', fontSize: '0.95rem', letterSpacing: '0.03em' }}
        >
          SPORTSVIEWTZ
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-6 px-4">
      <img
        src="/logo.jpg"
        alt="SportsViewTZ"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover mb-3"
        style={{ boxShadow: '0 0 40px rgba(242, 183, 5, 0.22)' }}
      />
      <h1
        className="text-2xl sm:text-3xl md:text-4xl text-[var(--text)] leading-none text-center"
        style={{ fontFamily: 'var(--font-brand)', letterSpacing: '0.05em' }}
      >
        SPORTSVIEWTZ
      </h1>
    </div>
  );
};
