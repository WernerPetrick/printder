import { Client, Account, Databases, Query, Permission, Role } from "appwrite";

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
  const queries = [Query.limit(limit), Query.offset(offset)];

  if (category) {
    queries.push(Query.equal("category", category));
    queries.push(Query.orderDesc("$createdAt"));
  } else {
    // Use likesCount descending so "All" shows popular models from mixed categories
    queries.push(Query.orderDesc("likesCount"));
  }

  return databases.listDocuments(DATABASE_ID, MODELS_COLLECTION_ID, queries);
}

export function getCategories() {
  return Promise.resolve([
    "2D Plates & Logos",
    "Action Figures & Statues",
    "Accessories",
    "Animals",
    "Anycubic Parts & Upgrades",
    "Architecture & Urbanism",
    "Audio",
    "Automotive",
    "Autumn & Halloween",
    "Bambu Lab Parts & Upgrades",
    "Bathroom",
    "Bedroom",
    "Board Games",
    "Building Toys",
    "Characters & Monsters",
    "Chemistry & Biology",
    "Computers",
    "Cosplay & Costumes",
    "Creality Parts & Upgrades",
    "Electronics",
    "Engineering",
    "Garage",
    "Haptic Models",
    "Historical Context",
    "Home Decor",
    "Home Medical Tools",
    "Indoor Sports",
    "Kitchen",
    "Living Room",
    "Masks",
    "Math",
    "Mechanical Parts",
    "Medical Tools",
    "Men",
    "Miniature Gaming Accessories",
    "Music",
    "Office",
    "Organizers",
    "Other Costume Accessories",
    "Other Fashion Accessories",
    "Other Gadgets",
    "Other House Equipment",
    "Other Ideas",
    "Other Learning",
    "Other Printer Parts & Upgrades",
    "Other Sports",
    "Other Toys & Games",
    "Outdoor & Garden",
    "Outdoor Sports",
    "Outdoor Toys",
    "People",
    "Pets",
    "Photo & Video",
    "Physics & Astronomy",
    "Portable Devices",
    "Props",
    "Props & Terrains",
    "Prusa Parts & Upgrades",
    "Puzzles & Brain-teasers",
    "RC & Robotics",
    "Sculptures",
    "Spring & Easter",
    "Summer",
    "Test Models",
    "Tools",
    "Vehicles",
    "Vehicles & Machines",
    "Video Games",
    "Virtual Reality",
    "Voron Parts & Upgrades",
    "Wall-mounted",
    "Winter & Christmas",
    "Winter Sports",
    "Women",
  ]);
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
  return databases.createDocument(
    DATABASE_ID,
    SWIPES_COLLECTION_ID,
    "unique()",
    { userId, modelId, action },
    [
      Permission.read(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ]
  );
}

export async function getModelById(modelId) {
  return databases.getDocument(DATABASE_ID, MODELS_COLLECTION_ID, modelId);
}

export async function deleteSwipe(swipeId) {
  return databases.deleteDocument(DATABASE_ID, SWIPES_COLLECTION_ID, swipeId);
}

export async function getUserPrints(userId, limit = 25, offset = 0) {
  return databases.listDocuments(DATABASE_ID, SWIPES_COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("action", "printed"),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
    Query.offset(offset),
  ]);
}

export async function getUserPrintedModelIds(userId) {
  const result = await databases.listDocuments(DATABASE_ID, SWIPES_COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("action", "printed"),
    Query.limit(1000),
  ]);
  const map = new Map();
  result.documents.forEach((doc) => map.set(doc.modelId, doc.$id));
  return map;
}
