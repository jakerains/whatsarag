import React, { useState } from 'react';
import { Binary, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';

interface Props {
  isActive: boolean;
}

export const Embedding: React.FC<Props> = ({ isActive }) => {
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const chunks = [
    {
      text: "The quick brown fox jumps over the lazy dog",
      embedding: [0.2, 0.5, -0.3, 0.8, -0.1],
      features: {
        "What's it about?": "A fox and a dog",
        "What's happening?": "The fox is jumping",
        "Key details": "The fox is quick and brown, the dog is lazy",
        "Main action": "Jumping"
      }
    },
    {
      text: "A wonderful serenity has taken possession of my entire soul",
      embedding: [-0.1, 0.7, 0.4, -0.2, 0.6],
      features: {
        "What's it about?": "A peaceful feeling",
        "What's happening?": "Someone is feeling serene",
        "Key details": "The feeling is wonderful and complete",
        "Emotion": "Serenity, peace"
      }
    },
    {
      text: "The sun is shining brightly in the clear blue sky",
      embedding: [0.6, -0.3, 0.1, 0.5, -0.4],
      features: {
        "What's it about?": "The weather",
        "What's happening?": "The sun is shining",
        "Key details": "The sky is clear and blue",
        "Main focus": "Sunny weather"
      }
    }
  ];

  const explanation = "The AI turns each piece of text into a special code (numbers) that helps it understand the meaning. It's like giving each piece a unique fingerprint that captures what it's about. This helps the AI find similar information later!";
  
  const tips = [
    "Think of it like translating words into a language that computers can understand better",
    "Similar meanings get similar number patterns - like how 'happy' and 'joyful' would get similar codes",
    "This helps the AI quickly find related information later",
    "It's similar to how your brain connects related words and ideas"
  ];

  return (
    <StepLayout
      title="2. Creating Memory Patterns"
      icon={<Binary className="w-6 h-6" />}
      isActive={isActive}
      explanation={explanation}
      tips={tips}
    >
      <div className="space-y-4">
        {chunks.map((chunk, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: isActive ? 0 : 20, 
              opacity: isActive ? 1 : 0 
            }}
            transition={{ delay: index * 0.3 }}
            className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border border-white/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-white/90 mb-2">{chunk.text}</div>
                <div className="font-mono text-xs text-blue-200 overflow-x-auto">
                  AI's number pattern: [{chunk.embedding.join(', ')}]
                </div>
              </div>
              <button
                onClick={() => setShowDetails(showDetails === index ? null : index)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {showDetails === index ? (
                  <EyeOff className="w-4 h-4 text-white/60" />
                ) : (
                  <Eye className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showDetails === index && (
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
                  <div className="grid gap-2">
                    {Object.entries(chunk.features).map(([category, terms]) => (
                      <div key={category} className="text-sm">
                        <span className="text-blue-200">{category}:</span>{" "}
                        <span className="text-white/80">{terms}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </StepLayout>
  );
};