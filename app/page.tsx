import CalcForm from "@/components/CalcForm";
import Hero from "@/components/Hero";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import WhoIsItFor from "@/components/WhoIsItFor";

export default async function Home() {
  return (
    <main>
      <Hero />
      <WhoIsItFor />
      <CalcForm />
      <SubscriptionPlans />
    </main>
  );
}
