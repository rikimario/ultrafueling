import getUser from "@/utils/supabase/user";

export default async function Home() {
  const user = await getUser();

  return (
    <main>
      <h1>Hello {user?.user_metadata.full_name}!</h1>
    </main>
  );
}
