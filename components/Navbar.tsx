import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import getUser from "@/utils/supabase/user";
import { logout } from "@/app/get-started/actions";
import Image from "next/image";

export default async function Navbar() {
  const user = await getUser();
  return (
    <nav className="flex justify-between border-b p-4 mb-4">
      <Link href="/">
        <span>UltraFueling</span>
      </Link>
      <div className="space-x-4">
        {user ? (
          <div className="flex gap-2">
            <Image
              className="rounded-full"
              alt="profile_picture"
              src={user?.user_metadata.picture}
              width={40}
              height={40}
            />

            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Link href="/get-started">
            <Button className={cn("bg-indigo-500 hover:bg-indigo-600")}>
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
