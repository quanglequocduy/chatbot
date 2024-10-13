// Load config
import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from '@langchain/openai';

// Ref: https://js.langchain.com/docs/integrations/llms/openai/
const llm = new OpenAI({
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = 'What would a good platform to connect homeowner with tradies in Australia?';

async function main(prompt) {
  let prompts = [];
  for (let i = 0; i < 5; i++) {
    prompts.push(prompt);
  }
  
  const result = await llm.generate(prompts);
  for (const text of result.generations) {
    console.log(text);
  }
}

main(prompt);



