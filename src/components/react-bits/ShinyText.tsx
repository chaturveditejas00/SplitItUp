import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  disabled?: boolean;
  speed?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = '',
  disabled = false,
  speed = 4,
}) => {
  return (
    <span
      className={`inline-block font-bold tracking-wider ${disabled ? '' : 'shimmer-text'} ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
};
