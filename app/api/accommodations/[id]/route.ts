import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accommodations } from "@/db/schema/karangtawulan";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [accommodation] = await db.select().from(accommodations).where(eq(accommodations.id, id));
    
    if (!accommodation) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }
    
    return NextResponse.json(accommodation);
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    return NextResponse.json({ error: "Failed to fetch accommodation" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const [updated] = await db.update(accommodations)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(accommodations.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating accommodation:", error);
    return NextResponse.json({ error: "Failed to update accommodation" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [deleted] = await db.delete(accommodations)
      .where(eq(accommodations.id, id))
      .returning();
    
    if (!deleted) {
      return NextResponse.json({ error: "Accommodation not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    return NextResponse.json({ error: "Failed to delete accommodation" }, { status: 500 });
  }
}
