"use client";

import React, { useEffect, useState } from "react";

import SavedPlansDialog from "./SavedPlansDialog";
import { useUser } from "@/contexts/UserContext";
import { Card } from "./ui/card";

export default function SavedPlans() {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/get-saved-plan");
      const data = await res.json();

      if (data.error) {
        console.error("Error fetching plans:", data.error);
        setPlans([]);
      } else {
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card className="w-full p-6 rounded-xl">
        <p className="text-muted-foreground">Loading your saved plans...</p>
      </Card>
    );
  }

  return <SavedPlansDialog plans={plans} />;
}
