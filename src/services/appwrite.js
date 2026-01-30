import { Client, Account, Databases, Query } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
export const MODELS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MODELS_COLLECTION_ID || "";
export const SWIPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SWIPES_COLLECTION_ID || "";

// Auth helpers
export async function createAccount(email, password, name) {
  const user = await account.create("unique()", email, password, name);
  await account.createEmailPasswordSession(email, password);
  return user;
}

export async function login(email, password) {
  return account.createEmailPasswordSession(email, password);
}

export async function logout() {
  return account.deleteSession("current");
}

export async function getCurrentUser() {
  return account.get();
}

// Database helpers
export async function getModels({ category = null, limit = 10, offset = 0 }) {
  const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc("$createdAt")];

  if (category) {
    queries.push(Query.equal("category", category));
  }

  return databases.listDocuments(DATABASE_ID, MODELS_COLLECTION_ID, queries);
}

export async function getCategories() {
  const result = await databases.listDocuments(DATABASE_ID, MODELS_COLLECTION_ID, [
    Query.limit(100),
    Query.select(["category"]),
  ]);

  const categories = [...new Set(result.documents.map((doc) => doc.category))];
  return categories.filter(Boolean).sort();
}

export async function getUserSwipes(userId) {
  return databases.listDocuments(DATABASE_ID, SWIPES_COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.limit(1000),
  ]);
}

export async function getUserFavorites(userId, limit = 25, offset = 0) {
  return databases.listDocuments(DATABASE_ID, SWIPES_COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("action", "liked"),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
    Query.offset(offset),
  ]);
}

export async function createSwipe(userId, modelId, action) {
  return databases.createDocument(DATABASE_ID, SWIPES_COLLECTION_ID, "unique()", {
    userId,
    modelId,
    action,
  });
}

export async function getModelById(modelId) {
  return databases.getDocument(DATABASE_ID, MODELS_COLLECTION_ID, modelId);
}
