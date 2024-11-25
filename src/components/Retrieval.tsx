import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepLayout } from './StepLayout';

interface Props {
  isActive: boolean;
}

export const Retrieval: React.FC<Props> = ({ isActive }) => {
  const [selectedQuery, setSelectedQuery] = useState<string>('');
  
  const queries = [
    "What's the weather like?",
    "Tell me about the fox",
    "Describe the feeling of serenity"
  ];

  const matches = {
    "What's the weather like?": [
      { text: "The sun is shining brightly in the clear blue sky", similarity: 0.92 },
      { text: "A wonderful serenity has taken possession of my entire soul", similarity: 0.45 }
    ],
    "Tell me about the fox": [
      { text: "The quick brown fox jumps over the lazy dog", similarity: 0.88 },
      { text: "The sun is shining brightly in the clear blue sky", similarity: 0.12 }
    ],
    "Describe the feeling of serenity": [
      { text: "A wonderful serenity has taken possession of my entire soul", similarity: 0.95 },
      { text: "The quick brown fox jumps over the lazy dog", similarity: 0.15 }
    ]
  };

  const explanation = "Semantic retrieval finds the most relevant chunks by comparing the similarity between the query's embedding and the embeddings of all chunks in the database.";
  
  const tips = [
    "Cosine similarity is commonly used to measure vector similarity",
    "A similarity threshold helps filter out irrelevant results",
    "Retrieved chunks provide context for the language model",
    "The number of chunks retrieved can be adjusted based on needs"
  ];

  return (
    <StepLayout
      title="3. Semantic Retrieval"
      icon={<Search className="w-6 h-6" />}
      isActive={isActive}
      explanation={explanation}
      tips={tips}
    >
      <div className="space-y-6">
        <div className="grid gap-2">
          {queries.map((query) => (
            <motion.button
              key={query}
              onClick={() => setSelectedQuery(query)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ 
                x: isActive ? 0 : -20,
                opacity: isActive ? 1 : 0,
                scale: selectedQuery === query ? 1.02 : 1
              }}
              className={`text-left p-3 rounded-lg backdrop-blur-sm border transition-all ${
                selectedQuery === query
                  ? 'bg-blue-500/30 border-blue-300/50'
                  : 'bg-white/20 border-white/20 hover:bg-white/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white">{query}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedQuery && (
            <motion.div
              key={selectedQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-white/60">
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">Retrieved chunks by relevance:</span>
              </div>

              {matches[selectedQuery as keyof typeof matches].map((match, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/20 p-4 rounded-lg backdrop-blur-sm border border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 px-2 py-1 rounded text-sm text-white/90">
                      {(match.similarity * 100).toFixed(0)}% match
                    </div>
                    <p className="flex-1 text-sm text-white/90">{match.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StepLayout>
  );
};