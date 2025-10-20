import getUser from "@/utils/supabase/user";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";

export default async function AuthPage() {
  const user = await getUser();
  if (user) redirect("/");

  return (
    <section className="flex items-center justify-center mt-10">
      <AuthForm />
    </section>
  );
}
