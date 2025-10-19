import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accessories } from "@/db/schema/karangtawulan";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [accessory] = await db.select().from(accessories).where(eq(accessories.id, id));
    
    if (!accessory) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }
    
    return NextResponse.json(accessory);
  } catch (error) {
    console.error("Error fetching accessory:", error);
    return NextResponse.json({ error: "Failed to fetch accessory" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const [updated] = await db.update(accessories)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(accessories.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating accessory:", error);
    return NextResponse.json({ error: "Failed to update accessory" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [deleted] = await db.delete(accessories)
      .where(eq(accessories.id, id))
      .returning();
    
    if (!deleted) {
      return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting accessory:", error);
    return NextResponse.json({ error: "Failed to delete accessory" }, { status: 500 });
  }
}
