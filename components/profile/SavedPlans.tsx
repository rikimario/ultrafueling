"use client";

import React, { useEffect, useState } from "react";

import SavedPlansDialog from "./SavedPlansDialog";
import { useUser } from "@/contexts/UserContext";

export default function SavedPlans() {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
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
    }
  };

  if (!user) return null;

  return <SavedPlansDialog plans={plans} />;
}
