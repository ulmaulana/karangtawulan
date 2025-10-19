import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema/karangtawulan";
import { eq } from "drizzle-orm";
import { packageUpdateSchema, validateInput } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// GET single package
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}

// PATCH update package
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 20 requests per menit
    const ip = getClientIp(request);
    const limit = rateLimit(`api-patch-${ip}`, { windowMs: 60000, max: 20 });
    
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak request, coba lagi nanti" },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetTime - Date.now()) / 1000)),
          }
        }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    
    // Validasi input
    const validation = validateInput(packageUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validasi gagal", 
        details: validation.errors.issues 
      }, { status: 400 });
    }
    
    const validatedData = validation.data;
    
    const [updated] = await db.update(packages)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))
      .returning();
    
    if (!updated) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

// DELETE package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 10 deletes per menit
    const ip = getClientIp(request);
    const limit = rateLimit(`api-delete-${ip}`, { windowMs: 60000, max: 10 });
    
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak request, coba lagi nanti" },
        { status: 429 }
      );
    }
    
    const { id } = await params;
    
    const [deleted] = await db.delete(packages)
      .where(eq(packages.id, id))
      .returning();
    
    if (!deleted) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
