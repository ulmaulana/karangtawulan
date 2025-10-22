import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { galleryImages } from "@/db/schema/karangtawulan";

export async function GET() {
  try {
    const images = await db.select().from(galleryImages);
    console.log('Fetched images count:', images.length);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: "Failed to fetch gallery images",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received payload:', body);
    
    const [newImage] = await db.insert(galleryImages).values({
      url: body.url,
      category: body.category,
      credit: body.credit,
      takenAt: body.takenAt ? new Date(body.takenAt) : null,
      published: body.published || false,
    }).returning();
    
    console.log('Image created:', newImage);
    
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: "Failed to create gallery image",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
