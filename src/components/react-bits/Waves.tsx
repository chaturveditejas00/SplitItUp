import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface WavesProps {
  className?: string;
  waveCount?: number;
}

export const Waves: React.FC<WavesProps> = ({ className = '', waveCount = 4 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';

    // Theme-based colors
    const primaryColor = isDark ? 'rgba(254, 81, 1, 0.07)' : 'rgba(225, 29, 72, 0.05)';
    const secondaryColor = isDark ? 'rgba(255, 42, 109, 0.05)' : 'rgba(254, 81, 1, 0.04)';
    const strokeColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';

    const render = () => {
      step += 0.008;
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw flowing sine waves
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const wavelength = width * (0.8 + i * 0.2);
        const amplitude = 35 + i * 15;
        const phase = step * (1 + i * 0.3) + i * 1.5;
        const yOffset = height * (0.35 + i * 0.12);

        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 8) {
          const y = yOffset + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, waveCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
