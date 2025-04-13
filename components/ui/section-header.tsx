import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  centered = true, 
  className = '' 
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="mb-4 text-section-title font-heading text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto text-section-subtitle text-secondary max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}