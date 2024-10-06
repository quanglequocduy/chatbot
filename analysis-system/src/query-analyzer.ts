import 'dotenv/config';
import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI } from '@langchain/openai';

const searchSchema = z.object({
  query: z.string().describe('Similarity search query applied to video transcripts'),
  publish_year: z.number().optional().describe('Year of video publication')
}).describe('Search over a database of tutorial videos about a software library.');

const system = `You are an expert at converting user questions into database queries.
You have access to a database of tutorial videos about a software library for building LLM-powered applications.
Given a question, return a list of database queries optimized to retrieve the most relevant results.

If there are acronyms or words you are not familiar with, do not try to rephrase them.`;


const prompt = ChatPromptTemplate.fromMessages([
  ['system', system],
  ['human', '${question}']
]);

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo-0125',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const structuredLLM = llm.withStructuredOutput(searchSchema, 
  {
    name: 'search',
  }
);

const queryAnalyzer = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
  },
  prompt,
  structuredLLM,
]);

export { queryAnalyzer };