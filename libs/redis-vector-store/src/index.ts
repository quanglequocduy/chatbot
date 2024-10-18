import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';
import { products } from './database/products';
import { addOpenAIEmbeddingsToRedis } from './open-ai';

async function main() {
  const redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });
  await redisClient.connect();

  if (!process.env.OPENAI_API_KEY) {
    return;
  }

  await addOpenAIEmbeddingsToRedis(
    products,
    redisClient,
    process.env.OPENAI_API_KEY
  )
}

main();

