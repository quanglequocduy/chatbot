import 'dotenv/config';
import { ChromaClient } from 'chromadb';

const chromaDbConfig = {
  host: process.env.CHROMA_DB_HOST || 'localhost',
  port: parseInt(process.env.CHROMA_DB_PORT || '8000', 10),
}

const chromaClient = new ChromaClient({
  path: `${chromaDbConfig.host}:${chromaDbConfig.port}`,
});

export { chromaClient };