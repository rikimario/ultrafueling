import { NextResponse } from "next/server";
import savePreferences from "@/utils/supabase/savePreferences";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, preferences } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await savePreferences(userId, preferences);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Save Preferences API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
