import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file" });

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const avatarUrlWithTimestamp = `${publicUrlData.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      picture: avatarUrlWithTimestamp,
      avatar_ext: fileExt,
    },
  });

  if (updateError) {
    console.error("Update user error:", updateError);
    return NextResponse.json(
      { error: "Failed to update user metadata" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    url: avatarUrlWithTimestamp,
  });
}
