// Load config
import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from '@langchain/openai';
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from '@langchain/core/prompts';

const model = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});

const template = 'What would a good platform to connect {userA} with {userB} in Australia?';

async function main(template) {
  const prompt = PromptTemplate.fromTemplate(template);
  const chain = new LLMChain({
    llm: model,
    prompt,
  });

  const resp = await chain.invoke({
    userA: 'homeowners',
    userB: 'tradespeople',
  });
  console.log(`Response: ${JSON.stringify(resp)}`);
}

main(template);