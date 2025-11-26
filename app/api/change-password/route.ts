import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { old_password, new_password, confirm_new_password } = await req.json();

  if (!old_password || !new_password || !confirm_new_password) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (new_password !== confirm_new_password) {
    return NextResponse.json(
      { error: "New passwords do not match." },
      { status: 400 }
    );
  }

  if (old_password === new_password) {
    return NextResponse.json(
      { error: "New password must be different from old password." },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: old_password,
  });

  if (signInError) {
    return NextResponse.json(
      { error: "Old password is incorrect." },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: new_password,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
