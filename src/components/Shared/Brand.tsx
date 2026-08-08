// src/components/Shared/Brand.tsx
import React from 'react';

interface BrandProps {
  size?: 'sm' | 'lg';
}

export const Brand: React.FC<BrandProps> = ({ size = 'sm' }) => {
  const logoClass = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleClass = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2">
      {/* Small logo, like YouTube/Instagram */}
      <img
        src="/logo.jpg"
        alt="Logo"
        className={`${logoClass} object-cover rounded-full border border-amber-500/50 shadow-sm`}
      />

      {/* Fantastic, neat font for the title */}
      <h1
        className={`${titleClass} tracking-wide bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm`}
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900 }}
      >
        SPORTSVIEWTZ
      </h1>
    </div>
  );
};