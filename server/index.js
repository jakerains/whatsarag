import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from 'dotenv';
import { DocumentStore } from './services/document-store.js';
import { AIService } from './services/ai-service.js';

config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize services
let documentStore;
let aiService;

try {
  documentStore = DocumentStore.getInstance();
  aiService = AIService.getInstance();
} catch (error) {
  console.error('Failed to initialize services:', error);
  process.exit(1);
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'RAG AI Chatbot API is running',
    endpoints: [
      '/api/chat',
      '/api/process-documents',
      '/api/documents',
      '/api/health',
      '/api/test-llm'
    ]
  });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: err.message || 'An unexpected error occurred'
  });
};

// Test LLM connection endpoint
app.get('/api/test-llm', async (req, res) => {
  try {
    const result = await aiService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

app.post('/api/process-documents', upload.array('files'), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    for (const file of req.files) {
      const text = file.buffer.toString('utf-8');
      await documentStore.addDocument(text, file.originalname);
    }

    res.json({ message: 'Documents processed successfully' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = documentStore.getContext();
    const response = await aiService.generateResponse(message, context);

    if (!response) {
      throw new Error('Failed to generate response');
    }

    res.json({ response });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/documents', (req, res, next) => {
  try {
    documentStore.clear();
    res.json({ message: 'Document store cleared successfully' });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    githubToken: !!process.env.GITHUB_TOKEN,
    timestamp: new Date().toISOString()
  });
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`GitHub Token configured: ${!!process.env.GITHUB_TOKEN}`);
  
  // Test LLM connection on startup
  aiService.testConnection()
    .then(result => {
      if (result.success) {
        console.log('LLM Connection Test: Success');
      } else {
        console.error('LLM Connection Test Failed:', result.error);
        console.error('Details:', result.details);
      }
    })
    .catch(error => {
      console.error('LLM Connection Test Error:', error);
    });
});