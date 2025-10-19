import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <main>
      <h1>Hello {user?.user_metadata.full_name}!</h1>
    </main>
  );
}
