import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { userId, advancedInput, advancedResult, aiPlan } = body;

    const { error } = await supabase.from("user_plans").insert({
      user_id: userId,
      input: advancedInput,
      result: advancedResult,
      ai_plan: aiPlan,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
