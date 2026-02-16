import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";



dotenv.config();

/* =========================
   OpenRouter Client
========================= */
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

/* =========================
   Pinecone Setup
========================= */
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

/* =========================
   Extract PDF Text
========================= */
async function extractTextFromPDF(path) {
  const data = new Uint8Array(fs.readFileSync(path));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

/* =========================
   Simple Text Splitter
========================= */
function splitText(text, chunkSize = 800, overlap = 100) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

/* =========================
   Embedding Function
========================= */
async function getEmbedding(text) {
  const response = await openrouter.embeddings.create({
    model: "text-embedding-3-small", // must match Pinecone dimension
    input: text,
  });

  return response.data[0].embedding;
}

/* =========================
   Ingest PDF
========================= */
async function ingestPDF() {
  try {
    console.log("Reading PDF...");

    const text = await extractTextFromPDF("./dsa_kb.pdf");

    const chunks = splitText(text, 800, 100);

    console.log(" Total chunks:", chunks.length);

    const vectors = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i]);

      console.log("Embedding dimension:", embedding.length);

      vectors.push({
        id: `doc-${i}`,
        values: embedding,
        metadata: {
          text: chunks[i],
        },
      });

      console.log(`Embedded ${i + 1}/${chunks.length}`);
    }

    

    const batchSize = 100; // safe size

   for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);

    console.log(`Uploading batch ${i / batchSize + 1}`);

     await index.upsert(batch);
   }


    console.log("Successfully stored in Pinecone!");

    const stats = await index.describeIndexStats();
    console.log("Pinecone Stats:", stats);
  } catch (err) {
    console.error("Error:", err);
  }
}

ingestPDF();
