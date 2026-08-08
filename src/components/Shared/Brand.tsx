// src/components/Shared/Brand.tsx
import React from 'react';

interface BrandProps {
  /** 'sm' = compact logo-then-title lockup used everywhere (top bars, headers) — the default. */
  size?: 'sm' | 'lg';
}

export const Brand: React.FC<BrandProps> = ({ size = 'sm' }) => {
  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="SportsViewTZ" className="w-10 h-10 rounded-xl object-cover" />
        <span
          className="text-[var(--text)] leading-none"
          style={{ fontFamily: 'var(--font-brand)', fontSize: '1.6rem', letterSpacing: '0.04em' }}
        >
          SPORTSVIEWTZ
        </span>
      </div>
    );
  }

  // Small, logo-first-then-title, single line — the YouTube/Instagram pattern.
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.jpg" alt="SportsViewTZ" className="w-7 h-7 rounded-md object-cover border border-[var(--border)]" />
      <span
        className="text-[var(--text)] leading-none"
        style={{ fontFamily: 'var(--font-brand)', fontSize: '1rem', letterSpacing: '0.03em' }}
      >
        SPORTSVIEWTZ
      </span>
    </div>
  );
};