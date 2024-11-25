import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, isActive = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
        y: isActive ? 0 : 20
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={clsx(
        "backdrop-blur-lg bg-white/30 rounded-xl p-6 shadow-xl border border-white/20",
        "transition-all duration-500 ease-out",
        className
      )}
    >
      {children}
    </motion.div>
  );
};