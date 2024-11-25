import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export class AzureAIService {
  private client: OpenAIClient;
  private static instance: AzureAIService;

  private constructor() {
    const endpoint = process.env.AZURE_ENDPOINT || "";
    const apiKey = process.env.AZURE_API_KEY || "";
    
    this.client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  }

  public static getInstance(): AzureAIService {
    if (!AzureAIService.instance) {
      AzureAIService.instance = new AzureAIService();
    }
    return AzureAIService.instance;
  }

  async generateResponse(message: string, context: string): Promise<string> {
    try {
      const messages = [
        { 
          role: "system", 
          content: `You are an interactive Retrieval-Augmented Generation (RAG) chatbot designed for an educational demo. 
          Use the following context to answer questions: ${context}
          
          If no documents are provided, encourage the user to upload documents to see RAG in action.
          Always be helpful, concise, and educational in your responses.`
        },
        { role: "user", content: message }
      ];

      const deploymentId = process.env.AZURE_DEPLOYMENT_ID || "gpt-4";
      const response = await this.client.getChatCompletions(deploymentId, messages, {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1
      });

      const firstChoice = response.choices[0];
      if (!firstChoice?.message?.content) {
        throw new Error('Invalid response from Azure OpenAI service');
      }

      return firstChoice.message.content;
    } catch (error) {
      console.error('Azure AI Service Error:', error);
      throw error;
    }
  }
}