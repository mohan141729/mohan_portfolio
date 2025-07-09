import React from 'react';

export default function SectionWrapper({ id, children, gradient, className, divider }) {
  return (
    <section
      id={id}
      className={`relative py-16 sm:py-20 lg:py-24 w-screen min-h-[80vh] ${gradient} flex flex-col items-center ${className || ''}`}
    >
      <div className="w-full max-w-6xl px-4 sm:px-6">
        {children}
      </div>
      {divider && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          {divider}
        </div>
      )}
    </section>
  );
} 