import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

console.log("Appwrite Config:", {
  databaseId: DATABASE_ID,
  collectionId: COLLECTION_ID,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
});

const database = new Databases(client);

// Updated to prevent duplicate movie entries
export const updateSearchCount = async (query: string, movie: Movie) => {
  console.log(`[updateSearchCount] Called with query="${query}" movie=${movie.title}`);

  try {
    // Check if a document for this movie already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("movie_id", movie.id), // use movie_id instead of searchTerm
    ]);

    console.log("[updateSearchCount] listDocuments result:", result.documents);

    if (result.documents.length > 0) {
      // If exists, increment count
      const existingMovie = result.documents[0];
      console.log("[updateSearchCount] Found existing document, updating count:", existingMovie.count);

      const updated = await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });

      console.log("[updateSearchCount] Document updated:", updated);
    } else {
      // If not, create a new document
      console.log("[updateSearchCount] No document found, creating new one");

      const created = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });

      console.log("[updateSearchCount] Document created:", created);
    }
  } catch (error) {
    console.error("[updateSearchCount] Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  console.log("[getTrendingMovies] Called");

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    console.log("[getTrendingMovies] listDocuments result:", result.documents);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("[getTrendingMovies] Error fetching trending movies:", error);
    return undefined;
  }
};
