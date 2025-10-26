"use client";

import React from "react";
import { Button } from "./ui/button";
import { goPremiumAction } from "@/app/get-started/actions";

export default function GoPremiumBtn() {
  const handleGoPremium = async () => {
    try {
      await goPremiumAction();
      alert("You are now a Premium user! 🎉");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
  return <Button onClick={handleGoPremium}>Go Premium</Button>;
}
