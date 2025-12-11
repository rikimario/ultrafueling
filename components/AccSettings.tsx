"use client";

import { Settings, UserRound } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
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
import { useUser } from "@/contexts/UserContext";
import DeleteAccount from "./DeleteAccount";

export default function AccSettings({
  preferences,
}: {
  preferences: Preferences;
}) {
  const { user, avatarUrl, updateAvatar } = useUser();
  const [form, setForm] = useState({
    username: user?.user_metadata.full_name,
    email: user?.email,
    password: "",
  });

  const [prefForm, setPrefForm] = useState({
    weightKg: preferences?.weightKg,
    sweatRateLPerHour: preferences?.sweatRateLPerHour,
    experienceLevel: preferences?.experienceLevel,
    goal: preferences?.goal,
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [pendingEmailMessage, setPendingEmailMessage] = useState("");

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

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File is too big — max 2MB.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("path", filePath);

    const res = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const json = await res.json();

    if (json.error) {
      toast.error(json.error);
    } else {
      updateAvatar(`${json.url}?t=${Date.now()}`);
    }
  };

  const handleSaveGeneral = async () => {
    const res = await fetch("/api/update-user", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        email: form.email,
        username: form.username,
        password: form.password,
      }),
    });

    const json = await res.json();

    if (json.pendingEmailChange) {
      setPendingEmailMessage("Check your inbox to confirm this change.");
      toast.info(
        "We emailed you a confirmation link. Your email will update after verification."
      );

      // DON'T reload – keep showing the new value
      return;
    }

    if (json.success) {
      toast.success("Account details updated!");
      window.location.reload();
    } else {
      toast.error(json.error);
    }
  };

  const handlePasswordChange = async () => {
    const res = await fetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify(passwordForm),
    });

    const json = await res.json();

    if (json.error) {
      return toast.error(json.error);
    }

    toast.success("Password updated successfully!");
    setPasswordForm({
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    });
  };

  return (
    <div>
      {/* Avatar section */}
      <div className="flex gap-3">
        {avatarUrl ? (
          <Image
            onClick={() => document.getElementById("avatarInput")?.click()}
            src={avatarUrl}
            alt="profile_picture"
            width={200}
            height={200}
            className="w-24 h-24 rounded-full mb-4 border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out object-cover cursor-pointer"
            priority
          />
        ) : (
          <UserRound
            onClick={() => document.getElementById("avatarInput")?.click()}
            className="w-24 h-24 rounded-full mb-4 border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out cursor-pointer"
            strokeWidth={0.3}
            width={100}
            height={100}
          />
        )}

        <span className="flex flex-col justify-center gap-1">
          <Button
            onClick={() => document.getElementById("avatarInput")?.click()}
            variant={"secondary"}
          >
            Upload Avatar
          </Button>
          <input
            id="avatarInput"
            type="file"
            accept="image/jpeg, image/png, image/webp, image/jpg"
            className="hidden"
            onChange={(e) => handleAvatarUpload(e)}
          />
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
          General Information
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
            {pendingEmailMessage && (
              <p className="text-sm font-semibold text-yellow-500 ml-2">
                {pendingEmailMessage}
              </p>
            )}
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
        </ul>
        <Button
          className={cn("text-gray-800 dark:hover:text-white")}
          type="button"
          variant="main"
          onClick={handleSaveGeneral}
        >
          Save changes
        </Button>
      </form>

      {/* Change password section */}

      <form className="w-full py-10">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <span>
            <Settings color="green" />
          </span>
          Change Password
        </p>
        <ul className="grid grid-cols-2 py-6 gap-6 space-y-3">
          <li className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              placeholder="Enter your current password"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  old_password: e.target.value,
                })
              }
            />
          </li>
          <li className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password: e.target.value,
                })
              }
            />
          </li>
          <li className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              placeholder="Comfirm your new password"
              type="password"
              value={passwordForm.confirm_new_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirm_new_password: e.target.value,
                })
              }
            />
          </li>
        </ul>

        <Button type="button" onClick={handlePasswordChange} variant={"main"}>
          Save changes
        </Button>
      </form>

      {/* Preferences settings */}
      <form className="w-full py-10">
        <p className="flex items-center gap-2 text-xl font-semibold">
          <span>
            <Settings color="green" />
          </span>
          Preferences
        </p>
        <ul className="grid grid-cols-2 py-6 gap-6 space-y-3">
          <li className="space-y-2">
            <Label className={cn("ml-2 pr-1")}>
              Weight (<span className="text-gray-500">kg</span>)
            </Label>
            <Input
              type="number"
              placeholder="Enter your weight"
              value={prefForm.weightKg ?? ""}
              onChange={(e) =>
                setPrefForm((prev) => ({
                  ...prev,
                  weightKg: Number(e.target.value),
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
              value={prefForm.sweatRateLPerHour ?? ""}
              onChange={(e) =>
                setPrefForm((prev) => ({
                  ...prev,
                  sweatRateLPerHour: Number(e.target.value),
                }))
              }
            />
          </li>
          <li className="space-y-2">
            <Label className={cn("px-1")}>Experience level</Label>
            <Select
              value={prefForm.experienceLevel ?? undefined}
              onValueChange={(value) =>
                handlePrefChange("experienceLevel", value)
              }
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

      {/* Delete account section */}

      <DeleteAccount />
    </div>
  );
}
