import 'dotenv/config';
import { DocumentInterface } from '@langchain/core/documents';
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { getYear } from 'date-fns';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { RunnableLambda } from "@langchain/core/runnables";
import { queryAnalyzer } from './query-analyzer';

const urls = [
  "https://www.youtube.com/watch?v=HAn9vnJy6S4",
  "https://www.youtube.com/watch?v=dA1cHGACXCo",
  "https://www.youtube.com/watch?v=ZcEMLz27sL4",
  "https://www.youtube.com/watch?v=hvAPnpSfSGo",
  "https://www.youtube.com/watch?v=EhlPDL4QrWY",
  "https://www.youtube.com/watch?v=mmBo8nlu2j0",
  "https://www.youtube.com/watch?v=rQdibOsL1ps",
  "https://www.youtube.com/watch?v=28lC4fqukoc",
  "https://www.youtube.com/watch?v=es-9MgxB-uc",
  "https://www.youtube.com/watch?v=wLRHwKuKvOE",
  "https://www.youtube.com/watch?v=ObIltMaRJvY",
  "https://www.youtube.com/watch?v=DjuXACWYkkU",
  "https://www.youtube.com/watch?v=o7C9ld6Ln-M",
];

const chromaDbConfig = {
  host: process.env.CHROMA_DB_HOST || 'localhost',
  port: parseInt(process.env.CHROMA_DB_PORT || '8000', 10),
};

async function getDocs() {
  let docs: Array<DocumentInterface> = [];
  for await (const url of urls) {
    const doc = await YoutubeLoader.createFromUrl(url, {
      language: 'en',
      addVideoInfo: true,
    }).load();
  
    docs = docs.concat(doc);
  }

  const dates = [
    new Date("Jan 31, 2024"),
    new Date("Jan 26, 2024"),
    new Date("Jan 24, 2024"),
    new Date("Jan 23, 2024"),
    new Date("Jan 16, 2024"),
    new Date("Jan 5, 2024"),
    new Date("Jan 2, 2024"),
    new Date("Dec 20, 2023"),
    new Date("Dec 19, 2023"),
    new Date("Nov 27, 2023"),
    new Date("Nov 22, 2023"),
    new Date("Nov 16, 2023"),
    new Date("Nov 2, 2023"),
  ];

  docs.forEach((doc, idx) => {
    doc.metadata.publish_year = getYear(dates[idx]);
    doc.metadata.publish_date = dates[idx];
  });

  return docs;
}

async function similarSearch(query: string) {
  const docs = await getDocs();  
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const chunkedDocs = await textSplitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await Chroma.fromDocuments(chunkedDocs, embeddings, {
    ...chromaDbConfig,
    collectionName: 'youtube-videos',
  });

  const searchResults = await vectorStore.similaritySearch(query);
  return {
    title: searchResults[0].metadata.title,
    content: searchResults[0].pageContent.slice(0, 500),
  }
}

const retrieval = async (input: {
  query: string;
  publish_year?: number;
}): Promise<DocumentInterface[]> => {
  const docs = await getDocs();  
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const chunkedDocs = await textSplitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await Chroma.fromDocuments(chunkedDocs, embeddings, {
    ...chromaDbConfig,
    collectionName: 'youtube-videos',
  });


  let _filter: Record<string, any> = {};
  if (input.publish_year) {
    _filter = { publish_year: input.publish_year };
  }

  const result = await vectorStore.similaritySearch(input.query, undefined, _filter);
  return result;
}

async function analyzeDoc(query: string) {
  const retrievalChain = queryAnalyzer.pipe(
    new RunnableLambda({
      func: async (input: any) => retrieval(input)
    })
  );
  const results = await retrievalChain.invoke(query);
  console.log(
    results.map((doc) => ({
      title: doc.metadata.title,
      year: doc.metadata.publish_date,
    }))
  );
}

analyzeDoc('videos on RAG published in 2023');
