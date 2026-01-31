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

// PUT /api/content/[id] - Update content item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, type } = body;

    const existingItem = contentStore.get(id);
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

    const updatedItem: ContentItem = {
      ...existingItem,
      title: title || existingItem.title,
      content: content || existingItem.content,
      type: type || existingItem.type,
      updatedAt: new Date().toISOString(),
    };

    contentStore.set(id, updatedItem);

    return NextResponse.json(
      { success: true, item: updatedItem },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 },
    );
  }
}

// DELETE /api/content/[id] - Delete content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    const existingItem = contentStore.get(id);
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

    contentStore.delete(id);

    return NextResponse.json(
      { success: true, message: "Content deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 },
    );
  }
}
