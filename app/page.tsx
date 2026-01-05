import CalcForm from "@/components/CalcForm";
import FQA from "@/components/FQA";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import WhoIsItFor from "@/components/WhoIsItFor";

export default async function Home() {
  return (
    <main>
      <Hero />
      <WhoIsItFor />
      <HowItWorks />
      <CalcForm />
      <SubscriptionPlans />
      <FQA />
    </main>
  );
}
