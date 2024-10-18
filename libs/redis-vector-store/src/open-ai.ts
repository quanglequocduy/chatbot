import { Document } from "@langchain/core/documents";
import { IProduct } from "./interface/IProduct";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RedisVectorStore } from "@langchain/redis";

export const addOpenAIEmbeddingsToRedis = async (
  _products: IProduct[],
  _redisClient: any,
  _openAIApiKey: string,
) => {
  if (_products?.length > 0 && _redisClient && _openAIApiKey) {
    const existingKeys = await _redisClient.keys('openAIProducts:*');
    if (existingKeys.length > 0) {
      console.log('OpenAI embeddings already exist in Redis');
      return;
    }

    const vectorDocs: Document[] = [];
    for (let product of _products) {
      let doc = new Document({
        metadata: {
          productId: product.productId,
        },
        pageContent: ` Product details are as follows:
                productId: ${product.productId}.
    
                productDisplayName: ${product.productDisplayName}.
                
                price: ${product.price}.
    
                variantName: ${product.variantName}.
    
                brandName: ${product.brandName}.
    
                ageGroup: ${product.ageGroup}.
    
                gender: ${product.gender}.
        
                Category:  ${product.displayCategories}, ${product.masterCategory_typeName} - ${product.subCategory_typeName}
    
                productDescription:  ${product.productDescriptors_description_value}`,
      });

      vectorDocs.push(doc);
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: _openAIApiKey,
    });


    const vectorStore = await RedisVectorStore.fromDocuments(
      vectorDocs,
      embeddings,
      {
        redisClient: _redisClient,
        indexName: 'openAIProductsIdx',
        keyPrefix: 'openAIProducts:',
      }
    );

    console.log(`Seeding OpenAI embeddings completed`);
  }
}