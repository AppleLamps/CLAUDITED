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

// GET /api/content - List all content
export async function GET() {
  try {
    const sql = getSql();
    const items = (await sql`
      SELECT
        id,
        title,
        content,
        type,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM content_items
      ORDER BY updated_at DESC
    `) as ContentItem[];

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

    const sql = getSql();
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      title,
      content,
      type: type as "note" | "update" | "link",
      createdAt: now,
      updatedAt: now,
    };

    const created = (await sql`
      INSERT INTO content_items (id, title, content, type, created_at, updated_at)
      VALUES (
        ${newItem.id},
        ${newItem.title},
        ${newItem.content},
        ${newItem.type},
        ${newItem.createdAt},
        ${newItem.updatedAt}
      )
      RETURNING
        id,
        title,
        content,
        type,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `) as ContentItem[];

    return NextResponse.json(
      { success: true, item: created[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 },
    );
  }
}
