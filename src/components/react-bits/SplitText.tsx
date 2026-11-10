import React from 'react';
import { motion } from 'motion/react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  duration = 0.5,
  as: Component = 'span',
}) => {
  const characters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex flex-wrap"
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={childVariants}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
};
