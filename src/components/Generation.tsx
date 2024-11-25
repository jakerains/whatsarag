import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';

interface Props {
  isActive: boolean;
}

export const Generation: React.FC<Props> = ({ isActive }) => {
  const [showStep, setShowStep] = useState(0);

  const steps = [
    {
      title: "Context Integration",
      content: "The retrieved chunks are formatted and combined with the user's query to create a comprehensive prompt for the language model.",
      example: `Query: "What's the weather like?"
Retrieved context: "The sun is shining brightly in the clear blue sky"
Formatted prompt: "Based on the following context, answer the question about the weather:
Context: The sun is shining brightly in the clear blue sky
Question: What's the weather like?"`
    },
    {
      title: "Response Generation",
      content: "The language model processes the prompt and generates a natural response using the provided context.",
      example: `Model's response: "Based on the context, it's a beautiful day! The sun is shining brightly and the sky is clear and blue, making for perfect weather conditions."`
    },
    {
      title: "Quality Assurance",
      content: "The response is checked to ensure it's relevant, accurate, and properly grounded in the provided context.",
      example: `✓ Response uses provided context
✓ Answer directly addresses the query
✓ Natural language style
✓ Factual accuracy maintained`
    }
  ];

  const explanation = "The final step combines retrieved context with the query to generate an accurate, context-aware response using a language model.";
  
  const tips = [
    "The language model uses retrieved context to ground its response",
    "Proper prompt engineering ensures high-quality outputs",
    "Responses maintain factual accuracy from the source material",
    "The system can cite sources to support its answers"
  ];

  return (
    <StepLayout
      title="4. Response Generation"
      icon={<MessageSquare className="w-6 h-6" />}
      isActive={isActive}
      explanation={explanation}
      tips={tips}
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setShowStep(index)}
              className={`flex-1 p-2 text-sm rounded-lg transition-colors ${
                showStep === index
                  ? 'bg-blue-500/30 text-white'
                  : 'bg-white/20 text-white/60 hover:bg-white/30'
              }`}
            >
              Step {index + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={showStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <h4 className="font-medium">{steps[showStep].title}</h4>
            </div>

            <p className="text-sm text-white/80">{steps[showStep].content}</p>

            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border border-white/20">
              <pre className="text-xs text-white/90 whitespace-pre-wrap font-mono">
                {steps[showStep].example}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </StepLayout>
  );
};