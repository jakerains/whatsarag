export class AIService {
  private static instance: AIService;
  private endpoint = "https://models.inference.ai.azure.com";
  private token: string;

  private constructor() {
    this.token = process.env.GITHUB_TOKEN || "";
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(message: string, context: string): Promise<string> {
    try {
      const response = await fetch(`${this.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an interactive Retrieval-Augmented Generation (RAG) chatbot designed for an educational demo. 
              Use the following context to answer questions: ${context}
              
              When a user uploads a file, process its contents and use it to answer questions.
              If no documents are provided, encourage the user to upload documents to see RAG in action.
              Always explain your reasoning and how RAG helps provide better answers.
              Keep responses concise, informative, and engaging.`
            },
            { role: "user", content: message }
          ],
          model: "gpt-4o-mini",
          temperature: 0.8,
          max_tokens: 4096,
          top_p: 1
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}