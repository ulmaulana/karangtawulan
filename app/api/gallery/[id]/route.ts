import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema/karangtawulan";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json({ error: "Failed to fetch gallery image" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Partial<typeof galleryImages.$inferInsert> = {
      ...body,
      updatedAt: new Date(),
    };
    
    if (body.takenAt) {
      updateData.takenAt = new Date(body.takenAt);
    }
    
    const [updated] = await db.update(galleryImages)
      .set(updateData)
      .where(eq(galleryImages.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [deleted] = await db.delete(galleryImages)
      .where(eq(galleryImages.id, id))
      .returning();
    
    if (!deleted) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
