import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from '@langchain/openai';
import { SimpleSequentialChain, LLMChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});

const template = 'What is a good name for a company that makes ${product}?';
const secondTemplate = 'Write a catch phrase for the following company: {company_name}';

async function main(template) {
  const firstPrompt = PromptTemplate.fromTemplate(template);
  const firstChain = new LLMChain({
    llm,
    prompt: firstPrompt,
  });

  const secondPrompt = PromptTemplate.fromTemplate(secondTemplate);
  const secondChain = new LLMChain({
    llm,
    prompt: secondPrompt,
  });

  const finalChain = new SimpleSequentialChain(
    {chains: [firstChain, secondChain], verbose:true}
  );

  const resp = await finalChain.run('colorful socks');
  console.log(`Response: ${JSON.stringify(resp)}`);
}

main(template);
