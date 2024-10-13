import 'dotenv/config';
import { DocumentInterface } from '@langchain/core/documents';
import { RunnableLambda } from "@langchain/core/runnables";
import { queryAnalyzer } from './query-analyzer';
import { initVectorStore } from './vector-store';

async function similarSearch(query: string) {
  const vectorStore = await initVectorStore();

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
  const vectorStore = await initVectorStore();

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
