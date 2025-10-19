import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema/karangtawulan";

export async function GET() {
  try {
    const allLeads = await db.select().from(leads);
    return NextResponse.json(allLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [newLead] = await db.insert(leads).values({
      kind: body.kind,
      payload: body.payload,
      userAgent: body.userAgent || request.headers.get("user-agent"),
      ip: body.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    }).returning();
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
