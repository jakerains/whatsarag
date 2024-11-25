import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageIdCounter = useRef(0);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  };

  useEffect(() => {
    const testLLMConnection = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/test-llm');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to connect to AI service');
        }

        setIsConnected(true);
        addMessage({
          id: generateMessageId(),
          role: 'assistant',
          content: "Hi! I'm your RAG-powered AI assistant. You can ask me questions about any documents you've uploaded, or try uploading a new document to see how I can help you understand its contents!"
        });
      } catch (error) {
        console.error('LLM Connection Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to connect to AI service';
        setError(errorMessage);
        addMessage({
          id: generateMessageId(),
          role: 'system',
          content: `Connection Error: ${errorMessage}. Please try again later.`
        });
      } finally {
        setIsLoading(false);
      }
    };

    testLLMConnection();
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isConnected) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    addMessage({
      id: generateMessageId(),
      role: 'user',
      content: userMessage
    });

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response from server');
      }

      addMessage({
        id: generateMessageId(),
        role: 'assistant',
        content: data.response
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from AI service';
      setError(errorMessage);
      addMessage({
        id: generateMessageId(),
        role: 'system',
        content: `Error: ${errorMessage}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Connection Status */}
      {!isConnected && !isLoading && (
        <div className="mb-4 p-3 bg-yellow-500/20 text-white rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Connecting to AI service...</span>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.role === 'system'
                    ? 'bg-red-500/20 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/20 p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-white/60" />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 bg-red-500/20 text-white px-4 py-2 rounded-lg">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Ask a question..." : "Connecting to AI service..."}
          className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !isConnected}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !isConnected}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};