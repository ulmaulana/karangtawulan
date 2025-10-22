import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role for admin operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch single destination
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching destination:", error);
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update destination
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('Updating destination:', params.id, body);

    const { data, error } = await supabase
      .from("destinations")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating destination:", error);
      return NextResponse.json(
        { error: "Failed to update destination", details: error.message },
        { status: 500 }
      );
    }

    console.log('Destination updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Delete destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from("destinations")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting destination:", error);
      return NextResponse.json(
        { error: "Failed to delete destination" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
