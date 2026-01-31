export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: "note" | "update" | "link";
  createdAt: string;
  updatedAt: string;
}

// In-memory storage - shared across API routes
// Note: In a production environment like Vercel, this will still be reset
// frequently as serverless functions spin down.
const globalContentStore = new Map<string, ContentItem>();

export const contentStore = globalContentStore;
