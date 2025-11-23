"use client";

import { Settings, UserRound } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Preferences } from "@/utils/supabase/savePreferences";
import { toast } from "sonner";

export default function AccSettings({
  user,
  preferences,
}: {
  user: any;
  preferences: Preferences;
}) {
  const [form, setForm] = useState({
    username: user?.user_metadata.full_name,
    email: user?.email,
    password: "",
  });

  const [prefForm, setPrefForm] = useState({
    weight: preferences?.weight,
    sweat_rate: preferences?.sweat_rate,
    exp_lvl: preferences?.exp_lvl,
    goal: preferences?.goal,
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrefChange = (field: string, value: string) => {
    setPrefForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePreferences = async () => {
    const res = await fetch("/api/save-preferences", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        preferences: prefForm,
      }),
    });

    const json = await res.json();
    if (json.success) toast.success("Preferences saved!");
  };
  return (
    <div>
      {/* Avatar section */}
      <div className="flex gap-3">
        {user?.user_metadata.picture ? (
          <Image
            src={user?.user_metadata.picture}
            alt="profile_picture"
            width={100}
            height={100}
            className="rounded-full mb-4 border-3 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
          />
        ) : (
          <UserRound
            className="w-32 h-32 rounded-full mx-auto mb-4 border-3 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
            strokeWidth={0.3}
            width={100}
            height={100}
          />
        )}

        <span className="flex flex-col justify-center gap-1">
          <Button variant={"secondary"}>Upload Avatar</Button>
          <p className="text-xs text-muted-foreground">
            Max size 2MB. Formats: JPG, PNG.
          </p>
        </span>
      </div>

      {/* General settings */}
      <form className="w-full py-10">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <span>
            <Settings color="green" />
          </span>
          General section
        </p>
        <ul className="grid grid-cols-2 py-6 gap-6 space-y-3">
          <li className="space-y-2">
            <Label className={cn("ml-2")}>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </li>
          <li className="space-y-2">
            <Label className={cn("ml-2")}>Username</Label>
            <Input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </li>
          <li className="space-y-2">
            <Label className={cn("ml-2")}>Password</Label>
            <Input
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </li>
        </ul>
      </form>

      {/* Preferances settings */}
      <form className="w-full py-2">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <span>
            <Settings color="green" />
          </span>
          Preferences section
        </p>
        <ul className="grid grid-cols-2 py-6 gap-6 space-y-3">
          <li className="space-y-2">
            <Label className={cn("ml-2 pr-1")}>
              Weight (<span className="text-gray-500">kg</span>)
            </Label>
            <Input
              type="number"
              placeholder="Enter your weight"
              value={prefForm.weight ?? ""}
              onChange={(e) =>
                setPrefForm((prev) => ({
                  ...prev,
                  weight: Number(e.target.value),
                }))
              }
            />
          </li>
          <li className="space-y-2">
            <Label className={cn("px-1")}>
              Sweat rate (<span className="text-gray-500">L/hour</span>)
            </Label>
            <Input
              type="number"
              placeholder="Enter your sweat rate"
              value={prefForm.sweat_rate ?? ""}
              onChange={(e) =>
                setPrefForm((prev) => ({
                  ...prev,
                  sweat_rate: Number(e.target.value),
                }))
              }
            />
          </li>
          <li className="space-y-2">
            <Label className={cn("px-1")}>Experience level</Label>
            <Select
              value={prefForm.exp_lvl ?? undefined}
              onValueChange={(value) => handlePrefChange("exp_lvl", value)}
            >
              <SelectTrigger className={cn("w-full")}>
                <SelectValue placeholder="Select an experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Experience level</SelectLabel>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Elite">Elite</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </li>
          <li className="space-y-2">
            <Label className={cn("px-1")}>Goal</Label>
            <Select
              value={prefForm.goal ?? undefined}
              onValueChange={(value) =>
                handlePrefChange("goal", value as "finish" | "performance")
              }
            >
              <SelectTrigger className={cn("w-full")}>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Goal</SelectLabel>
                  <SelectItem value="finish">Finish</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </li>
        </ul>
        <Button type="button" onClick={handleSavePreferences} variant={"main"}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
