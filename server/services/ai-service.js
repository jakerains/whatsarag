import OpenAI from "openai";

export class AIService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    
    if (!this.token) {
      throw new Error('GitHub token is not configured');
    }

    this.client = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: this.token
    });
  }

  static getInstance() {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async testConnection() {
    try {
      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a test assistant. Respond with 'Connection successful!'" },
          { role: "user", content: "Test connection" }
        ],
        model: "gpt-4o-mini",
        temperature: 0.8,
        max_tokens: 4096,
        top_p: 1
      });

      return {
        success: true,
        message: response.choices[0].message.content
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        details: error
      };
    }
  }

  async generateResponse(message, context) {
    try {
      const hasContext = context && context !== "No documents have been uploaded yet.";
      const systemMessage = hasContext
        ? `You are an interactive Retrieval-Augmented Generation (RAG) chatbot designed for an educational demo. 
           Use the following context to answer questions:\n\n${context}`
        : `You are an interactive Retrieval-Augmented Generation (RAG) chatbot designed for an educational demo.
           I notice you haven't uploaded any documents yet. I can still explain how RAG systems work, or you can try uploading some documents to see the system in action!

           When a user uploads a file, I process its contents, retrieve relevant information, and answer questions based on the file's context.
           I always explain my reasoning and provide brief, accessible explanations of how RAG supports my answers.
           I aim to be engaging, patient, and fun to interact with, ensuring users feel comfortable experimenting with the system.`;

      const response = await this.client.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        model: "gpt-4o-mini",
        temperature: 0.8,
        max_tokens: 4096,
        top_p: 1
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

AIService.instance = null;