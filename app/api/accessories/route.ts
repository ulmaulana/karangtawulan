import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accessories } from "@/db/schema/karangtawulan";

export async function GET() {
  try {
    const allAccessories = await db.select().from(accessories);
    return NextResponse.json(allAccessories);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [newAccessory] = await db.insert(accessories).values({
      name: body.name,
      priceIdr: body.priceIdr,
      stock: body.stock,
      photoUrl: body.photoUrl,
      shortDesc: body.shortDesc,
      published: body.published || false,
    }).returning();
    
    return NextResponse.json(newAccessory, { status: 201 });
  } catch (error) {
    console.error("Error creating accessory:", error);
    return NextResponse.json({ error: "Failed to create accessory" }, { status: 500 });
  }
}
