// import getUser from "@/utils/supabase/user";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import { createClient } from "@/utils/supabase/server";

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  return (
    <section className="mt-10 flex items-center justify-center">
      <AuthForm />
    </section>
  );
}
