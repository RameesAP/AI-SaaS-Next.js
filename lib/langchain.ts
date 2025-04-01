import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { CohereEmbeddings } from "@langchain/cohere";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama-3.3-70b-versatile",
});

//✅✅✅
// const model = new ChatOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   modelName: "gpt-4o",
// });

//✅✅✅
//chatwithpdf is takes 1536 dimensions if you have open i key then use this
// export const indexName = "chatwithpdf";

// chatwithpdf2 is takes 1024 dimensions
export const indexName = "chatwithpdf2";

async function fetchMessageFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("user not found");
  }

  console.log(" --- FETCHING CHAT HISTORY FROM THE FIRESTORE DATABASE --- ");
  //get last 6 messages from the database
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    // .limit(6)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(
    `  ---- fetched last ${chatHistory.length} messages successfully ----`
  );

  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not found");
  }

  console.log(" --- Fetching the download URL from Firebase... ---- ");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found");
  }

  console.log(` --- Download url fetched successfully ${downloadUrl}  --- `);
  //fetch the pdf from specified url
  const response = await fetch(downloadUrl);

  //load the pdf into a pdfdocument object;
  const data = await response.blob();

  //load the pdf document from the specified path
  console.log(" --- Loading PDF document ... ---");

  const loader = new PDFLoader(data);
  const docs = await loader.load();

  //split the loaded document into smaller parts for easier processing
  console.log(" --- Splitting the document into smaller parts ... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(` --- Split into ${splitDocs.length} parts ---`);
  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  //Generate embeddings { numerical representations} for the split document
  console.log(" ---- Generating embeddings.... ---- ");

  //✅✅✅
  //if you have the openai api key, you can use the openai embeddings
  // const embeddings = new OpenAIEmbeddings();

  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY, // Use Cohere API Key
    model: "embed-english-v3.0",
  });

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `-----Namespace  ${docId} already exists, reusing existing embeddings...-----`
    );
    //this type error
    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    //if namespace does not exist, download the pdf from firestore via the stored download url  & genrate the
    // embeddings and store them in the pinecone vectore store
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- storing the embeddings in namespace ${docId} in the ${indexName} pinecone vector store... ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone Vector Store not found");
  }

  //create a retriver to search through the vector store

  console.log(" --- CREATE A RETRIEVER --- ");
  const retriever = pineconeVectorStore.asRetriever();

  //fetch the chat history from the database
  const chatHistory = await fetchMessageFromDB(docId);

  //Define the prompt template for genarating search queries based on conversation history

  console.log(" --- DEFINE  A PROMPT TEMPLATE --- ");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory, //insret the actual chat history here

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation genrate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  //create a history-aware retrivee chain that uses the model , retriever, and prompt
  console.log(" --- create a history-aware retriver chain --- ");

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  //Define a prompt template for answering questions based on retrieved context

  console.log(" --- DEFINE A PROMPT TEMPLATE FOR ANSWERING QUESTIONS  --- ");
  const historyAwareRetrieverlPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context:\n\n{context}",
    ],

    ...chatHistory,
    ["user", "{input}"],
  ]);
};


