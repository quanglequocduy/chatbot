import { DocumentInterface } from '@langchain/core/documents';
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getYear } from 'date-fns';

import { Chroma } from '@langchain/community/vectorstores/chroma';

const chromaDbConfig = {
  host: process.env.CHROMA_DB_HOST || 'localhost',
  port: parseInt(process.env.CHROMA_DB_PORT || '8000', 10),
};

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

export async function initVectorStore() {
  const docs = await getDocs();
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const chunkedDocs = await textSplitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await Chroma.fromDocuments(
    chunkedDocs,
    embeddings,
    {
      ...chromaDbConfig,
      collectionName: 'youtube_videos',
    }
  );

  return vectorStore;
}