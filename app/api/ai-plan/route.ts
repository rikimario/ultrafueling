// /app/api/ai-plan/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, advancedInput, advancedResult } = body;

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // verify user is premium in Supabase
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, is_premium")
      .eq("id", userId)
      .single();

    if (error || !profile || !profile.is_premium) {
      return NextResponse.json({ error: "User not premium" }, { status: 403 });
    }

    // Build a clear prompt
    const prompt = `
You are an expert ultra-distance sports nutrition coach.
Input data:
- runner profile: ${JSON.stringify(advancedInput, null, 2)}
- calculated plan: ${JSON.stringify(advancedResult, null, 2)}

Produce:
1) A concise hour-by-hour fueling script (what to eat/drink each hour: gels, scoops, tablets, solids, exact fluid volumes).
2) Practical tips for GI management and how to adapt plan during race.
3) A short "what to pack" checklist (quantities for a 1-person race kit).
Make it clear, numbered, and actionable. Avoid vague language.
`;

    // Call OpenAI (chat)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // pick a lower-cost capable chat model — change if you have a preferred model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.2,
    });

    const planText =
      completion.choices?.[0]?.message?.content ?? "No plan generated.";
    return NextResponse.json({ plan: planText });
  } catch (err: any) {
    console.error("AI Plan Error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
