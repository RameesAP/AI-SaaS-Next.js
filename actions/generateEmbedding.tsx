"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  auth().protect(); //protect the route with clerk

  // turn a pdf to embeddings [0.01234455, 0.234234, ...]
  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath("/dashboard");
  return { completed: true };
}



