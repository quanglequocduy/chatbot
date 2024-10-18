import * as dotenv from 'dotenv';
dotenv.config();

import { RedisVectorStore } from '@langchain/redis';
import { OpenAIEmbeddings } from '@langchain/openai';

import { createClient } from 'redis';
import { docs } from './documents';

async function initVectorStore() {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  });
  
  const redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });
  await redisClient.connect();
  
  const vectorStore = new RedisVectorStore(embeddings, {
    redisClient,
    indexName: 'langchain-testing',
  });

  return vectorStore;
}

async function main() {
  const vectorStore = await initVectorStore();

  await vectorStore.addDocuments(docs);

  const similaritySearchResults = await vectorStore.similaritySearch(
    'biology',
    2
  );

  for (const doc of similaritySearchResults) {
    console.log(doc.pageContent);
  }
}

main();

