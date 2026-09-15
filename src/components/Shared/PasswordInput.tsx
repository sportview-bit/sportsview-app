// src/components/Shared/PasswordInput.tsx
import React, { useState } from 'react';

export const PasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...rest} type={visible ? 'text' : 'password'} className={`${className} pr-16`} />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};