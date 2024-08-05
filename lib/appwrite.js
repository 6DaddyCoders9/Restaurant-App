import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.daddycoders.restaurant_app",
  projectId: "669a65ea002a33b71b23",
  storageId: "669a6697001b6020cad3",
  databaseId: "669a661e0038e75498a6",
  userCollectionId: "669a663400218ca7e6b9",
  restaurantCollectionId: "66b0df660035a9568bc6",
  menuCollectionId: "66b0e018000426a323bf",
  reviewCollectionId: "66b0e1ed001b8c1d368e",
  reservationCollectionId: "66b0e2cf002ebbedfd34"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// User Functions
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Restaurant Functions
export const listRestaurants = async () => {
  try {
    const restaurants = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.restaurantCollectionId
    );

    return restaurants.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Menu Functions
export const listMenuItems = async (restaurantId) => {
  try {
    const menuItems = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      [Query.equal("restaurant_id", restaurantId)]
    );

    return menuItems.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Review Functions
export const createReview = async (reviewData) => {
  try {
    const newReview = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      ID.unique(),
      reviewData
    );

    return newReview;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const listReviews = async (restaurantId) => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      [Query.equal("restaurant_id", restaurantId)]
    );

    return reviews.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Reservation Functions
export const createReservation = async (reservationData) => {
  try {
    const newReservation = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      ID.unique(),
      reservationData
    );

    return newReservation;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const listReservations = async (userId) => {
  try {
    const reservations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      [Query.equal("user_id", userId)]
    );

    return reservations.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
