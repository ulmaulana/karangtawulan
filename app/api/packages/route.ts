import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { packages } from "@/db/schema/karangtawulan";
import { eq } from "drizzle-orm";
import { packageSchema, validateInput } from "@/lib/validation/schemas";

// GET all packages
export async function GET() {
  try {
    const allPackages = await db.select().from(packages).orderBy(packages.sortOrder);
    return NextResponse.json(allPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

// POST create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const validation = validateInput(packageSchema, body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Validasi gagal", 
        details: validation.errors.issues 
      }, { status: 400 });
    }
    
    const validatedData = validation.data;
    
    const [newPackage] = await db.insert(packages).values({
      nama: validatedData.nama,
      harga: validatedData.harga,
      paxMin: validatedData.paxMin,
      paxMax: validatedData.paxMax,
      durasiJam: validatedData.durasiJam,
      facilities: validatedData.facilities,
      notes: validatedData.notes || null,
      dpPercent: validatedData.dpPercent || 50,
      published: validatedData.published || false,
      sortOrder: validatedData.sortOrder || 0,
    }).returning();
    
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
