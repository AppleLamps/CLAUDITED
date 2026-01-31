import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { contentStore, ContentItem } from "@/lib/store";

// Helper to verify authentication
async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return false;
  return verifyToken(token);
}

// GET /api/content - List all content
export async function GET(request: NextRequest) {
  try {
    const items = Array.from(contentStore.values()).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { title, content, type = "note" } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      title,
      content,
      type: type as "note" | "update" | "link",
      createdAt: now,
      updatedAt: now,
    };

    contentStore.set(newItem.id, newItem);

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 },
    );
  }
}
