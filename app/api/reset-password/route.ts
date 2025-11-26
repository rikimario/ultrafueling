import { NextResponse } from "next/server";
import { resetPassword } from "@/utils/supabase/resetPassword";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const result = await resetPassword(email);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Password reset email sent!",
  });
}
