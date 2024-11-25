import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    pageNumber?: number;
  };
}

export class DocumentStore {
  private chunks: DocumentChunk[] = [];
  private static instance: DocumentStore;
  private textSplitter: RecursiveCharacterTextSplitter;

  private constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }

  public static getInstance(): DocumentStore {
    if (!DocumentStore.instance) {
      DocumentStore.instance = new DocumentStore();
    }
    return DocumentStore.instance;
  }

  async addDocument(text: string, source: string): Promise<void> {
    const documents = await this.textSplitter.createDocuments([text]);
    
    const newChunks = documents.map(doc => ({
      content: doc.pageContent,
      metadata: {
        source,
        ...doc.metadata
      }
    }));

    this.chunks = [...this.chunks, ...newChunks];
  }

  getContext(): string {
    if (this.chunks.length === 0) {
      return "No documents have been uploaded yet.";
    }

    return this.chunks.map(chunk => chunk.content).join("\n\n");
  }

  clear(): void {
    this.chunks = [];
  }
}