import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, ChevronLeft, Info, RotateCcw } from 'lucide-react';
import { DocumentChunking } from './components/DocumentChunking';
import { Embedding } from './components/Embedding';
import { Retrieval } from './components/Retrieval';
import { Generation } from './components/Generation';
import { ChatInterface } from './components/ChatInterface';
import { ProgressSteps } from './components/ProgressSteps';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const handleBrainClick = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setShowChat(true);
      setShowIntro(false);
    }, 1500);
  };

  const handleNext = () => {
    if (showIntro) {
      setShowIntro(false);
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowChat(true);
    }
  };

  const handleBack = () => {
    if (showChat) {
      setShowChat(false);
      setCurrentStep(3);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (!showIntro) {
      setShowIntro(true);
    }
  };

  const handleStartOver = () => {
    setShowChat(false);
    setCurrentStep(0);
    setShowIntro(true);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    setShowChat(false);
  };

  const steps = [
    { component: DocumentChunking },
    { component: Embedding },
    { component: Retrieval },
    { component: Generation }
  ];

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Background blur circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col min-h-screen">
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="relative inline-block">
                <button
                  onClick={handleBrainClick}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full"
                  title="Skip to Chatbot"
                >
                  <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </button>
                <AnimatePresence>
                  {showPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    >
                      Ohh, You're smart eh? 🧠✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">How RAG AI Chatbots Work</h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              {showChat 
                ? "Try out the chatbot! Ask about the weather, the fox, or serenity."
                : "Let's explore how modern AI chatbots understand and answer your questions using RAG (Retrieval-Augmented Generation)."}
            </p>
          </div>

          {/* Progress Steps */}
          {!showChat && !showIntro && <ProgressSteps currentStep={currentStep} onStepClick={handleStepClick} />}

          {/* Navigation buttons */}
          <div className="flex justify-between mb-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: showChat || (!showIntro && currentStep > 0) ? 1 : 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 bg-white/20 text-white px-3 py-2 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/30 transition-colors disabled:opacity-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            {showChat ? (
              <motion.button
                onClick={handleStartOver}
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <span>
                  {showIntro ? "Let's Begin" : currentStep === 3 ? 'Try the Chatbot' : 'Next'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Main Content */}
          <div className="min-h-[80vh]">
            <AnimatePresence mode="wait">
              {showIntro ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
                >
                  <div className="max-w-2xl mx-auto space-y-6 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Info className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold">Welcome to Your RAG AI Learning Journey!</h2>
                    </div>
                    
                    <p>
                      Ever wondered how AI chatbots like ChatGPT actually work? How do they know what to say and where do they get their information from? You're in the right place to find out!
                    </p>

                    <div className="bg-white/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">What You'll Learn:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-blue-300">•</span>
                          How chatbots break down and understand information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-300">•</span>
                          The way AI "remembers" and finds relevant information
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-300">•</span>
                          How it puts everything together to answer your questions
                        </li>
                      </ul>
                    </div>

                    <p>
                      We'll walk through each step with simple examples and clear explanations. By the end, you'll understand the basics of how modern AI chatbots work, and you'll even get to try one out yourself!
                    </p>

                    <p className="text-sm text-white/70">
                      Ready to start? Click "Let's Begin" to dive in!
                    </p>
                  </div>
                </motion.div>
              ) : !showChat ? (
                <motion.div
                  key="step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <CurrentComponent isActive={true} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ChatInterface />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-white/60 text-sm">
          Brought to you by <a href="https://www.x.com/jakerains" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 transition-colors">GenAI Jake</a>
        </footer>
      </div>
    </div>
  );
}

export default App;