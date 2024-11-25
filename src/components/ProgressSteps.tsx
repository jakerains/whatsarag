import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { 
  SplitSquareHorizontal, 
  Binary, 
  Search, 
  MessageSquare 
} from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { icon: SplitSquareHorizontal, label: 'Document Chunking' },
    { icon: Binary, label: 'Vector Embedding' },
    { icon: Search, label: 'Semantic Retrieval' },
    { icon: MessageSquare, label: 'Response Generation' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4 md:mb-12">
      <div className="relative flex justify-between">
        {/* Base line that's always visible */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/20 -z-20" />
        
        {/* Progress line that animates */}
        <div className="absolute top-5 left-0 right-0 h-[2px] -z-10">
          <motion.div 
            className="h-full bg-blue-500/50 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (currentStep + 1) / steps.length }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {steps.map((step, index) => {
          const isComplete = currentStep > index;
          const isCurrent = currentStep === index;
          const Icon = step.icon;

          return (
            <div 
              key={index} 
              className="flex flex-col items-center relative group"
              style={{ width: `${100 / steps.length}%` }}
            >
              <motion.button
                onClick={() => onStepClick?.(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer
                  ${isComplete || isCurrent
                    ? 'bg-blue-500/50 border-blue-300 hover:bg-blue-500/70'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  borderColor: isComplete || isCurrent ? 'rgb(147, 197, 253)' : 'rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isComplete ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-white/60'}`} />
                )}
              </motion.button>
              
              <motion.span 
                className="text-sm mt-2 text-center hidden sm:block md:text-base whitespace-nowrap px-1"
                animate={{
                  color: isCurrent ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)'
                }}
              >
                {step.label}
              </motion.span>
              
              {/* Mobile tooltip */}
              <motion.div
                className="absolute top-12 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none
                  opacity-0 group-hover:opacity-100 transition-opacity sm:hidden whitespace-nowrap"
              >
                {step.label}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};