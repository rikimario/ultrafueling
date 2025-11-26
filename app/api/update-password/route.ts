import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { code, password } = await req.json();

  if (!code || !password) {
    return NextResponse.json(
      { error: "Code and password are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Exchange the code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );

  if (exchangeError) {
    console.error("Code exchange error:", exchangeError);
    return NextResponse.json(
      { error: "Invalid or expired reset link" },
      { status: 400 }
    );
  }

  // Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: password,
  });

  if (updateError) {
    console.error("Password update error:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Password updated successfully",
  });
}
