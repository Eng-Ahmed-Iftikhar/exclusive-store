import React from 'react';

interface BadgeProps {
  count: number;
  max?: number;
  className?: string;
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  max = 99,
  className = '',
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ${className}`}
      aria-label={`Unread notifications: ${displayCount}`}
    >
      {children ? children : displayCount}
    </span>
  );
};

export default Badge;
