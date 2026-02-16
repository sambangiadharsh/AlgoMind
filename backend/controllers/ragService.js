import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

dotenv.config();

// Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

// OpenRouter (LLM)
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// open router  Embedding
async function getEmbedding(text) {
  const response = await openrouter.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}


export async function askDSA(question) {
  //  Get embedding
  const queryVector = await getEmbedding(question);

  // Search Pinecone
  const searchResult = await index.query({
    vector: queryVector,
    topK: 4,
    includeMetadata: true,
  });
  

  if (!searchResult.matches || searchResult.matches.length === 0) {
  return "I could not find relevant information in the DSA knowledge base.";
  }

  const context = searchResult.matches
    .map(match => match.metadata.text)
    .join("\n\n");


  // Ask OpenRouter
  const completion = await openrouter.chat.completions.create({
    model: "meta-llama/llama-3-70b-instruct",
    messages: [
      { role: "system", content: "You are a competitive programming mentor." },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  return completion.choices[0].message.content;
}
