import SavedPlans from "@/components/SavedPlans";
import { Card, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="w-full flex gap-6">
        {/* Left Profile Info */}
        <div className="max-h-96 min-w-64 bg-white p-6 rounded-2xl shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Runner Info</h2>
          <ul className="text-gray-700 space-y-2">
            <li>
              <strong>Name:</strong> John Doe
            </li>
            <li>
              <strong>Age:</strong> 29
            </li>
            <li>
              <strong>Weight:</strong> 72 kg
            </li>
            <li>
              <strong>Training Level:</strong> Advanced
            </li>
          </ul>
        </div>

        {/* Right Saved Results Section */}
        <SavedPlans />
      </div>
    </div>
  );
}
