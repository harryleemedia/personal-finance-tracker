import { ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export function GlassContainer({
  children,
  className = '',
  variant = 'light',
  padding = 'md',
  hover = false,
}: GlassContainerProps) {
  const variantStyles = {
    light: 'bg-white/10',
    medium: 'bg-white/20',
    dark: 'bg-black/10',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const baseStyles = `
    backdrop-blur-md
    border border-white/20
    rounded-2xl
    shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    transition-all duration-300
  `;

  const hoverStyles = hover
    ? 'hover:shadow-[0_10px_40px_0_rgba(31,38,135,0.45)] hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
