import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number; // seconds
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  speed = 30,
}) => {
  return (
    <div className={`overflow-hidden select-none flex w-full relative ${className}`}>
      <div
        className={`${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
