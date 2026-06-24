import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const userRequests = new Map<string, number[]>();

function checkRateLimit(
  userId: string,
  maxRequests = 10,
  windowMs = 60000,
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const userTimes = userRequests.get(userId) || [];

  // ✅ Filter out old requests outside the time window
  const recentRequests = userTimes.filter((time) => now - time < windowMs);

  // ✅ Check if user has exceeded limit
  const allowed = recentRequests.length < maxRequests;
  const remaining = Math.max(0, maxRequests - recentRequests.length);

  // ✅ Calculate when the limit resets (oldest request + window)
  const resetAt =
    recentRequests.length > 0 ? recentRequests[0] + windowMs : now + windowMs;

  // ✅ Only add new request if allowed
  if (allowed) {
    recentRequests.push(now);
  }

  // ✅ Update the map with cleaned array
  userRequests.set(userId, recentRequests);

  return { allowed, remaining, resetAt };
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ CHECK RATE LIMIT IMMEDIATELY AFTER AUTH
    const rateLimit = checkRateLimit(user.id, 10, 60000); // 10 per minute

    if (!rateLimit.allowed) {
      const waitSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${waitSeconds} seconds.`,
          retryAfter: waitSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(waitSeconds),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.floor(rateLimit.resetAt / 1000)),
          },
        },
      );
    }

    const body = await req.json();
    const { advancedInput, advancedResult } = body;

    // ✅ Validate required fields
    if (!advancedInput || !advancedResult) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 },
      );
    }

    // ✅ Validate input ranges
    if (advancedInput.distanceKm < 1 || advancedInput.distanceKm > 500) {
      return NextResponse.json({ error: "Invalid distance" }, { status: 400 });
    }

    if (advancedInput.durationHours < 1 || advancedInput.durationHours > 100) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    // ✅ Check premium access
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, subscription_status")
      .eq("id", user.id)
      .single();

    const { data: trailHistory } = await supabase
      .from("trial_history")
      .select("trail_ends_at")
      .eq("email", user.email)
      .maybeSingle();

    const allowed =
      profile?.subscription_status === "active" ||
      profile?.subscription_status === "trialing" ||
      trailHistory?.trail_ends_at < new Date().toISOString();

    if (error || !profile || !allowed) {
      return NextResponse.json({ error: "User not premium" }, { status: 403 });
    }

    // ✅ Limit JSON string size
    const inputStr = JSON.stringify(advancedInput, null, 2);
    const resultStr = JSON.stringify(advancedResult, null, 2);

    if (inputStr.length > 30000 || resultStr.length > 30000) {
      return NextResponse.json(
        { error: "Input data too large" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert ultra-distance sports nutrition coach who specializes in creating personalized race fueling plans for trail and ultra runners. 
Your goal is to turn the numeric data into a clear, realistic, and race-day-ready fueling guide that a runner could print or follow from a watch.
Use professional but simple language.

Input data:
- Runner profile: ${inputStr}
- Calculated plan: ${resultStr}

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
      { status: 500 },
    );
  }
}
