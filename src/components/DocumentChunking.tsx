import React, { useState } from 'react';
import { SplitSquareHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';

interface Props {
  isActive: boolean;
}

export const DocumentChunking: React.FC<Props> = ({ isActive }) => {
  const [expandedChunk, setExpandedChunk] = useState<number | null>(null);
  const document = `The quick brown fox jumps over the lazy dog. A wonderful serenity has taken possession of my entire soul. The sun is shining brightly in the clear blue sky. This is a beautiful day with perfect weather conditions. Nature is truly remarkable in its splendor.`;
  const chunks = document.split('. ').filter(chunk => chunk.length > 0);

  const explanation = "Just like how you might break a long book into chapters to make it easier to read, AI breaks down long texts into smaller pieces that are easier to understand and remember. Think of it like creating bite-sized pieces of information!";
  
  const tips = [
    "Breaking text into smaller pieces helps the AI understand and remember information better - just like how we learn better with flashcards",
    "Each piece keeps enough information to make sense on its own - like how each paragraph in a story should make sense by itself",
    "The AI can quickly find the right pieces later when it needs to answer questions",
    "This is similar to how you might highlight important parts in a textbook to find them later"
  ];

  return (
    <StepLayout
      title="1. Breaking Down Information"
      icon={<SplitSquareHorizontal className="w-6 h-6" />}
      isActive={isActive}
      explanation={explanation}
      tips={tips}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20"
        >
          <h4 className="text-white font-medium mb-2">Original Text</h4>
          <p className="text-white/80 text-sm">{document}</p>
        </motion.div>

        <div className="space-y-2">
          <h4 className="text-white font-medium">Broken Into Pieces</h4>
          <p className="text-sm text-white/70 mb-4">Click each piece to learn more about it!</p>
          
          {chunks.map((chunk, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: isActive ? 0 : -20, 
                opacity: isActive ? 1 : 0 
              }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <button
                onClick={() => setExpandedChunk(expandedChunk === index ? null : index)}
                className="w-full text-left bg-white/20 p-3 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <div className="bg-blue-500/20 px-2 py-1 rounded text-xs text-blue-200">
                    Piece {index + 1}
                  </div>
                  <p className="flex-1 text-sm text-white/90">{chunk}</p>
                  {expandedChunk === index ? (
                    <ChevronUp className="w-4 h-4 text-white/60" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {expandedChunk === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: {
                          height: {
                            duration: 0.3,
                            ease: "easeOut"
                          },
                          opacity: {
                            duration: 0.2,
                            delay: 0.1
                          }
                        }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: {
                          height: {
                            duration: 0.3,
                            ease: "easeIn"
                          },
                          opacity: {
                            duration: 0.2
                          }
                        }
                      }}
                      className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm text-white/80">
                        <p>
                          <span className="text-blue-200">Size:</span> {chunk.length} characters
                        </p>
                        <p>
                          <span className="text-blue-200">Words:</span> {chunk.split(' ').length} words
                        </p>
                        <p>
                          <span className="text-blue-200">Why this is useful:</span> This piece contains a complete thought that the AI can easily understand and use later when answering questions.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};