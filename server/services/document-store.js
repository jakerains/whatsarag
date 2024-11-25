export class DocumentStore {
  constructor() {
    this.chunks = [];
  }

  static getInstance() {
    if (!DocumentStore.instance) {
      DocumentStore.instance = new DocumentStore();
    }
    return DocumentStore.instance;
  }

  async addDocument(text, source) {
    // Split text into chunks of roughly 1000 characters
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
    const processedChunks = chunks.map(chunk => ({
      content: chunk.trim(),
      metadata: { source }
    }));

    this.chunks = [...this.chunks, ...processedChunks];
  }

  getContext() {
    if (this.chunks.length === 0) {
      return "No documents have been uploaded yet.";
    }

    return this.chunks.map(chunk => chunk.content).join("\n\n");
  }

  clear() {
    this.chunks = [];
  }
}

DocumentStore.instance = null;