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
You are an elite ultra-distance sports nutrition coach with 15+ years of experience coaching athletes at UTMB, Western States, and Comrades. You specialize in evidence-based race fueling strategies for trail and ultra runners of all levels.

Your task: Transform the numeric fueling data below into a concise, race-day-ready coaching guide that a runner can actually use on race day — whether printed, saved on a phone, or memorized.

Runner & Race Data:
- Runner profile: ${inputStr}
- Calculated fueling plan: ${resultStr}

Key context to apply in your response:
- Terrain: ${advancedInput.terrain} — adjust food texture and intake timing accordingly (e.g. mountain terrain = slower pace, more time to eat solids)
- Temperature: ${advancedInput.temperatureC}°C — adjust hydration urgency and sodium emphasis
- Experience level: ${advancedInput.experienceLevel} — match complexity of advice to runner's level
- Goal: ${advancedInput.goal} — ${advancedInput.goal === "performance" ? "push limits, aggressive fueling from minute 1" : "conservative approach, prioritize finishing strong"}
- Duration: ${advancedInput.durationHours}h — ${advancedInput.durationHours < 1 ? "very short effort, minimal fueling needed" : advancedInput.durationHours < 3 ? "short effort, light fueling" : advancedInput.durationHours < 6 ? "medium effort, structured fueling" : "long effort, full fueling strategy required"}

Instructions:
- Apply real coaching insight — do NOT simply restate the numbers
- Be specific and actionable — avoid vague phrases like "eat something" or "stay hydrated"
- Adapt all advice to the specific terrain, temperature, duration and experience level above
- Flag any red flags (e.g. high heat + long duration = extra sodium priority)

Respond in **Markdown** with exactly this structure:

### 1️⃣ Adaptation & GI Management Tips
- Give exactly 4 practical, evidence-based tips for this specific runner and race
- Tip 1: GI protection strategy specific to the terrain and duration
- Tip 2: How to adjust intake if it gets harder than expected (heat spike, fatigue, nausea)
- Tip 3: Sodium and electrolyte timing specific to the temperature
- Tip 4: One common mistake runners make at this distance/terrain and how to avoid it
- Write each tip as 1-2 sentences maximum — clear and direct

### 2️⃣ Race-Day Packing Checklist
- List exact quantities based on the calculated plan
- Format as a simple checklist the runner can tick off before the race
- Group items: Carb sources | Fluids | Electrolytes | Extras/Backup
- Include 1-2 optional items (e.g. caffeine gel for hour 6+, backup salt tabs)
- Flag anything the runner should NOT pack (e.g. heavy solid food for very hot races)

Hard constraints:
- Total output: 350 words maximum
- Use metric units only (g, ml, L, km)
- No generic advice that would apply to any runner — every sentence must be specific to THIS runner's data
- Do not mention specific hour numbers or timestamps
- Packing quantities must match the calculated plan within ±10%
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
