export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: "note" | "update" | "link";
  createdAt: string;
  updatedAt: string;
}
