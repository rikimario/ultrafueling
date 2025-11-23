import SavedPlans from "@/components/SavedPlans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import getUser from "@/utils/supabase/user";
import { Mail, UserRound } from "lucide-react";
import Image from "next/image";
import React from "react";

export default async function Profile() {
  const user = await getUser();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="w-full flex gap-6">
        {/* Left Profile Info */}
        <div className="max-h-96 min-w-1/4 bg-white p-6 rounded-2xl shadow-md col-span-1">
          {user?.user_metadata.picture ? (
            <Image
              src={user?.user_metadata.picture}
              alt="profile_picture"
              width={130}
              height={130}
              className="rounded-full mx-auto mb-4 border-3 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
            />
          ) : (
            <UserRound
              className="w-32 h-32 rounded-full mx-auto mb-4 border-3 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
              strokeWidth={0.3}
              width={100}
              height={100}
            />
          )}
          <div className="text-center">
            <p className="mb-2 text-2xl font-semibold">
              {user?.user_metadata.full_name}
            </p>
            <p className="mb-2 text-muted-foreground flex items-center justify-center gap-2">
              <Mail width={15} height={15} /> {user?.email}
            </p>
          </div>

          <div>
            <Button variant={"main"} className={cn("w-full mt-4 ")}>
              Edit Profile
            </Button>
            <Button variant={"secondary"} className={cn("w-full mt-2")}>
              Change Password
            </Button>
          </div>
        </div>

        {/* Right Saved Results Section */}
        <SavedPlans />
      </div>
    </div>
  );
}
