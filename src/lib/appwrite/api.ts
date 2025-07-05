import { ID, Query } from "appwrite";
import { account, appwriteConfig, databases } from "./config";
import type { CartItem, Order, User } from "./types";

export async function createUser(user: User){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error;

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                userId: newAccount.$id,
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone
            }
        );

        const session = await signIn(user.email, user.password)

        return session

    } catch (error) {
        console.log("Не удалось зарегистрировать пользователя:", error)
    }

}

export async function signIn(email: string, password: string){
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
      const currentAccount = await account.get();
  
      if (!currentAccount) return null;
  
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('userId', currentAccount.$id)]
      );
  
      if (res.total === 0) return null;
  
      return res.documents[0] as unknown as User;
    } catch (err) {
      console.log("Ошибка при получении текущего пользователя:", err);
      return null;
    }
  }
  
  // Получить пользователя по userId
  export async function getUserById(userId: string): Promise<User | null> {
    try {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('userId', userId)]
      );
  
      if (res.total === 0) return null;
  
      return res.documents[0] as unknown as User;
    } catch (err) {
      console.log("Ошибка при получении пользователя по ID:", err);
      return null;
    }
  }

  export async function signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.log("Ошибка при выходе из аккаунта:", error);
    }
  }

  export async function addPizzaToCart(
    userId: string,
    pizzaId: number,
    dough: string,
    size: string,
    ingredient: string[],
    totalPrice: number,
    name: string
  ) {
    try {

      const ingredientsArray = Array.isArray(ingredient) 
      ? ingredient 
      : [ingredient].filter(Boolean);

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        ID.unique(),
        {
          userId,
          pizzaId: pizzaId.toString(),
          dough,
          size,
          ingredient: ingredientsArray,
          totalPrice: totalPrice.toString(),
          name
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      location.reload()
    }
  }

  export async function getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        [Query.equal('userId', userId)]
      );
      return response.documents as unknown as CartItem[];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  }

  export async function deleteCartItems(userId: string){
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        [Query.equal('userId', userId)]
      )

      await Promise.all(
        response.documents.map(item => 
          databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.cartCollectionId,
            item.$id
          )
        )
      );
    } catch (error) {
      console.log("Failed to delete cart items:", error)
    }
  }

  export const createOrder = async (order: Order) => {
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.orderCollectionId,
        ID.unique(),
        order
      );
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
};