import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getSql } from "@/lib/db";
import type { ContentItem } from "@/lib/types";

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
    const sql = getSql();
    const { id } = await params;
    const body = await request.json();
    const { title, content, type } = body;

    const existing = (await sql`
      SELECT
        id,
        title,
        content,
        type,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM content_items
      WHERE id = ${id}
    `) as ContentItem[];
    const existingItem = existing[0];
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

    const updated = (await sql`
      UPDATE content_items
      SET
        title = ${updatedItem.title},
        content = ${updatedItem.content},
        type = ${updatedItem.type},
        updated_at = ${updatedItem.updatedAt}
      WHERE id = ${id}
      RETURNING
        id,
        title,
        content,
        type,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `) as ContentItem[];

    return NextResponse.json(
      { success: true, item: updated[0] },
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
  _request: NextRequest,
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
    const sql = getSql();
    const { id } = await params;

    const deleted = (await sql`
      DELETE FROM content_items
      WHERE id = ${id}
      RETURNING id
    `) as { id: string }[];
    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 },
      );
    }

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
