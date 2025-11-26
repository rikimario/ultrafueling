import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { email, username, password } = await req.json();

  const { data: userData, error: authError } = await supabase.auth.updateUser({
    ...(email ? { email } : {}),
    ...(password ? { password } : {}),
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (userData?.user?.new_email) {
    return NextResponse.json({
      pendingEmailChange: true,
      message: "A confirmation email has been sent.",
    });
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { full_name: username },
  });

  if (metaError) {
    return NextResponse.json({ error: metaError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
