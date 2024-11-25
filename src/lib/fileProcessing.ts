import { pipeline } from '@xenova/transformers';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ProcessedChunk {
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    pageNumber?: number;
  };
}

// Initialize the embedding model
let embedder: any = null;
const initializeEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
};

// Extract text from different file types
export async function extractText(file: File): Promise<string> {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } 
  
  if (fileType === 'text/plain') {
    return await file.text();
  }
  
  if (fileType.includes('word') || fileType.includes('docx')) {
    throw new Error('Word documents are not supported in the browser version. Please convert to PDF or text file.');
  }
  
  throw new Error(`Unsupported file type: ${fileType}`);
}

// Split text into chunks
export function splitIntoChunks(text: string, chunkSize: number = 500): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= chunkSize) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

// Generate embeddings for chunks
export async function generateEmbeddings(chunks: string[]): Promise<ProcessedChunk[]> {
  const model = await initializeEmbedder();
  const processedChunks: ProcessedChunk[] = [];
  
  for (const chunk of chunks) {
    const output = await model(chunk, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);
    
    processedChunks.push({
      text: chunk,
      embedding,
      metadata: {
        source: 'uploaded-document'
      }
    });
  }
  
  return processedChunks;
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Find most similar chunks for a query
export async function findSimilarChunks(
  query: string,
  chunks: ProcessedChunk[],
  topK: number = 3
): Promise<ProcessedChunk[]> {
  const model = await initializeEmbedder();
  const queryEmbedding = Array.from(await model(query, { pooling: 'mean', normalize: true }).data);
  
  const similarities = chunks.map(chunk => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topK).map(s => s.chunk);
}