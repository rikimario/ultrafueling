import React from "react";
import { Card, CardTitle } from "./ui/card";
import getUser from "@/utils/supabase/user";
import getSavedPlans from "@/utils/supabase/savedPlans";
import Link from "next/link";

export default async function SavedPlans() {
  const user = await getUser();

  if (!user) return null;

  const plans = await getSavedPlans(user.id);
  return (
    <Card className="w-full bg-white p-6">
      <CardTitle className="text-xl font-semibold mb-4">
        Saved Calculator Results
      </CardTitle>

      {/* Example Saved Result Card */}
      {plans.length > 0 && <p>You have {plans.length} saved results</p>}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-lg">Ultra Marathon Calculation</h3>
          <p className="text-gray-600 text-sm mt-1">Saved: Jan 15, 2025</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p>
              <strong>Distance:</strong> 50 km
            </p>
            <p>
              <strong>Estimated Calories:</strong> 4,850 kcal
            </p>
            <p>
              <strong>Fuel Needed:</strong> 290g carbs
            </p>
            <p>
              <strong>Hydration:</strong> 1.8 L recommended
            </p>
          </div>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
            View Details
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-lg">Ultra Marathon Calculation</h3>
          <p className="text-gray-600 text-sm mt-1">Saved: Jan 15, 2025</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p>
              <strong>Distance:</strong> 50 km
            </p>
            <p>
              <strong>Estimated Calories:</strong> 4,850 kcal
            </p>
            <p>
              <strong>Fuel Needed:</strong> 290g carbs
            </p>
            <p>
              <strong>Hydration:</strong> 1.8 L recommended
            </p>
          </div>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
            View Details
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-lg">Ultra Marathon Calculation</h3>
          <p className="text-gray-600 text-sm mt-1">Saved: Jan 15, 2025</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p>
              <strong>Distance:</strong> 50 km
            </p>
            <p>
              <strong>Estimated Calories:</strong> 4,850 kcal
            </p>
            <p>
              <strong>Fuel Needed:</strong> 290g carbs
            </p>
            <p>
              <strong>Hydration:</strong> 1.8 L recommended
            </p>
          </div>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
            View Details
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-lg">Ultra Marathon Calculation</h3>
          <p className="text-gray-600 text-sm mt-1">Saved: Jan 15, 2025</p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p>
              <strong>Distance:</strong> 50 km
            </p>
            <p>
              <strong>Estimated Calories:</strong> 4,850 kcal
            </p>
            <p>
              <strong>Fuel Needed:</strong> 290g carbs
            </p>
            <p>
              <strong>Hydration:</strong> 1.8 L recommended
            </p>
          </div>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
            View Details
          </button>
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const input = plan.input;
          const result = plan.result;

          return (
            <div
              key={plan.id}
              className="bg-gray-100 p-4 rounded-xl mb-4 shadow-sm"
            >
              <h3 className="font-semibold text-lg">
                {input?.distanceKm} km Ultra
              </h3>

              <p className="text-gray-600 text-sm mt-1">
                Saved: {new Date(plan.created_at).toLocaleDateString()}
              </p>

              <div className="mt-3 space-y-1 text-gray-700 text-sm">
                <p>
                  <strong>Calories:</strong> {result?.totalCalories} kcal
                </p>
                <p>
                  <strong>Carbs:</strong> {result?.totalCarbsGrams} g
                </p>
                <p>
                  <strong>Hydration:</strong> {result?.totalFluidsL} L
                </p>
              </div>

              <Link href={`/plan/${plan.id}`}>
                <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Additional Placeholder for More Results */}
      <div className="text-gray-500 text-sm italic">
        More results will appear as you save them...
      </div>
    </Card>
  );
}
