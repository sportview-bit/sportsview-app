// src/components/Shared/Brand.tsx
import React from 'react';

export const Brand: React.FC<{ size?: 'lg' | 'sm' }> = ({ size = 'lg' }) => {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2.5">
        <img src="/logo.jpg" alt="SportsViewTZ" className="w-9 h-9 rounded-lg object-cover border border-[var(--border)]" />
        <span
          className="text-[var(--text)] leading-none"
          style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', letterSpacing: '0.04em' }}
        >
          SPORTSVIEWTZ
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src="/logo.jpg"
        alt="SportsViewTZ"
        className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover mb-4"
        style={{ boxShadow: '0 0 50px rgba(242, 183, 5, 0.25)' }}
      />
      <h1
        className="text-5xl md:text-6xl text-[var(--text)] leading-none"
        style={{ fontFamily: 'var(--font-brand)', letterSpacing: '0.08em' }}
      >
        SPORTSVIEWTZ
      </h1>
    </div>
  );
};
