import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accommodations } from "@/db/schema/karangtawulan";

export async function GET() {
  try {
    const allAccommodations = await db.select().from(accommodations);
    return NextResponse.json(allAccommodations);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json({ error: "Failed to fetch accommodations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [newAccommodation] = await db.insert(accommodations).values({
      name: body.name,
      type: body.type,
      distanceKm: body.distanceKm,
      priceFromIdr: body.priceFromIdr,
      facilities: body.facilities,
      contact: body.contact,
      photoUrl: body.photoUrl,
      rules: body.rules,
      published: body.published || false,
    }).returning();
    
    return NextResponse.json(newAccommodation, { status: 201 });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return NextResponse.json({ error: "Failed to create accommodation" }, { status: 500 });
  }
}
