import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface StepLayoutProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
  explanation: string;
  tips: string[];
}

export const StepLayout: React.FC<StepLayoutProps> = ({
  title,
  icon,
  isActive,
  children,
  explanation,
  tips,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full space-y-4"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 text-white"
      >
        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-white/70">{explanation}</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr] flex-1 min-h-0">
        {/* Left Panel - Interactive Demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>

        {/* Right Panel - Info & Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 min-h-0 flex flex-col"
        >
          {/* How it Works */}
          <motion.div 
            className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h4 
              className="flex items-center gap-2 text-white font-medium mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Info className="w-4 h-4" />
              How it works
            </motion.h4>
            <motion.p 
              className="text-white/90 text-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {explanation}
            </motion.p>
          </motion.div>

          {/* Key Points */}
          <motion.div 
            className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 flex-1"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.h4 
              className="text-white font-medium mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Key Points
            </motion.h4>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-white/90"
                >
                  <motion.span 
                    className="text-blue-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    •
                  </motion.span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};