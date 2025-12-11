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
    //     const prompt = `
    // You are an expert ultra-distance sports nutrition coach.
    // Input data:
    // - runner profile: ${JSON.stringify(advancedInput, null, 2)}
    // - calculated plan: ${JSON.stringify(advancedResult, null, 2)}

    // Produce:
    // 1) A concise hour-by-hour fueling script (what to eat/drink each hour: gels, scoops, tablets, solids, exact fluid volumes).
    // 2) Practical tips for GI management and how to adapt plan during race.
    // 3) A short "what to pack" checklist (quantities for a 1-person race kit).
    // Make it clear, numbered, and actionable. Avoid vague language.
    // `;

    // ### 1️⃣ Hour-by-Hour Fueling Plan
    // - Each hour should be clearly labeled (Hour 1, Hour 2, etc.).
    // - Include calories, carbs (g), sodium (mg), fluids (ml), and specific food items.
    // - Keep each hour short and easy to follow.
    const prompt = `
You are an expert ultra-distance sports nutrition coach who specializes in creating personalized race fueling plans for trail and ultra runners. 
Your goal is to turn the numeric data into a clear, realistic, and race-day-ready fueling guide that a runner could print or follow from a watch.
Use professional but simple language.

Input data:
- Runner profile: ${JSON.stringify(advancedInput, null, 2)}
- Calculated plan: ${JSON.stringify(advancedResult, null, 2)}

Improve this plan to make it more race-ready, realistic, and easy to follow.
Do not simply restate the numbers — apply coaching insight, adjust for terrain, temperature, and aid stations.

Respond in **Markdown** with the following structure:


### 1️⃣ Adaptation & GI Management Tips
- Give 3–5 practical, evidence-based tips for avoiding GI issues.
- Mention how to adjust intake in heat, cold, or altitude.
- Exclude any hour-by-hour details. Do not mention specific hours, times, or numeric fueling amounts.

### 2️⃣ Packing Checklist
- Provide exact quantities for one runner based on the plan (e.g. gels, soft flasks, electrolytes, solids).
- Include optional items like caffeine sources or backups.

Constraints:
- Assume checkpoints provide food and water; include only what the runner must carry.
- Do not exaggerate quantities; be realistic.
- Keep total caloric intake within ±10% of the calculated result.
- Use metric units.
- Keep total output under 400 words.
`;

    // Call OpenAI (chat)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
