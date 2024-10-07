import "pdf-parse"; // Peer dep
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from 'path';

const filePath = path.resolve(__dirname, '../data/nke-10k-2023.pdf');
const loader = new PDFLoader(filePath);

async function main() {
  try {
    const docs = await loader.load();

    // console.log(docs.length);  
    console.log(docs[0].pageContent.slice(0, 100));
    console.log(docs[0].metadata);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

main();
