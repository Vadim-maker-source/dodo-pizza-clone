import { Account, Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    pizzaCollectionId: import.meta.env.VITE_APPWRITE_PIZZA_COLLECTION_ID,
    orderCollectionId: import.meta.env.VITE_APPWRITE_ORDER_COLLECTION_ID,
    cartCollectionId: import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID,
}

const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const storage = new Storage(client);
export const account = new Account(client);
export const databases = new Databases(client);