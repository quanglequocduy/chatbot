// Load config
import dotenv from 'dotenv';
dotenv.config();

import { HuggingFaceInference } from '@langchain/community/llms/hf';

// Ref: https://js.langchain.com/docs/integrations/llms/huggingface_inference/
const llm = new HuggingFaceInference({
  model: 'gpt2',
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
  temperature: 0,
});

const prompt = 'What are good fitness tips for beginners?';

async function main(prompt) {
  const res = await llm.invoke(prompt);
  console.log(res);
}

main(prompt);