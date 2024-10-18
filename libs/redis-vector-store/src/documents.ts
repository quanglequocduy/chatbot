import type { Document } from '@langchain/core/documents';

const document1: Document = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { type: "example" },
};

const document2: Document = {
  pageContent: "Buildings are made out of brick",
  metadata: { type: "example" },
};

const document3: Document = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { type: "example" },
};

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { type: "example" },
};

const docs = [
  document1,
  document2,
  document3,
  document4
];

export { docs };