import 'dotenv/config';
import "pdf-parse";
import path from 'path';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';
import { Chroma } from '@langchain/community/vectorstores/chroma';

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const openAIModel = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chromaDbConfig = {
  host: process.env.CHROMA_DB_HOST || 'localhost',
  port: parseInt(process.env.CHROMA_DB_PORT || '8000', 10),
};

async function loadPdf(filePath: string) {
  const loader = new PDFLoader(filePath);
  return loader.load();
}

async function extractTextFromPdf(filePath: string): Promise<Document[]> {
  try {
    const docs = await loadPdf(filePath);
    return docs;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return [];
  }
}

async function initVectorStore(docs: Document[]) {
  try {
    const vectorStore = await Chroma.fromDocuments(
      docs,
      embeddings,
      {
        ...chromaDbConfig,
        collectionName: 'pdf_data',
      }
    );
    return vectorStore;
  } catch (error) {
    console.error('Error init vector store:', error);
  }
}

async function answerQuestions(query: string, vectorStore: Chroma) {
  try {
    const searchResults = await vectorStore.similaritySearch(query);
    const context = searchResults.map(result => result.pageContent).join('\n\n');
    const response = await openAIModel.generate([
      `Context: ${context}\n\nQuestion: ${query}\nAnswer:`
    ]);

    return JSON.stringify(response.generations[0]);
  } catch (error) {
    console.error('Error answering questions:', error);
  }
}

async function main() {
  const filePath = path.resolve(__dirname, '../data/nke-10k-2023.pdf');
  try {
    const docs = await extractTextFromPdf(filePath);
    const vectorStore = await initVectorStore(docs);

    if (!vectorStore) {
      console.error('Error initializing vector store');
      return;
    }

    const query = 'What is the revenue of Nike in 2023?';
    const response = await answerQuestions(query, vectorStore);
    console.log(response);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

main();
