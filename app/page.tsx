import CalcForm from "@/components/CalcForm";
import Hero from "@/components/Hero";
import SubscriptionPlans from "@/components/SubscriptionPlans";

export default async function Home() {
  return (
    <main>
      <Hero />
      <CalcForm />
      <SubscriptionPlans />
    </main>
  );
}
