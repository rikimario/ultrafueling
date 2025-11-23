import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import getUser from "@/utils/supabase/user";
import { logout } from "@/app/get-started/actions";
import Image from "next/image";
import { CircleUserRound, LogOutIcon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="flex justify-between items-center border-b p-4 mb-4">
      <Link href="/">
        <span>UltraFueling</span>
      </Link>
      <div className="space-x-4 flex justify-center items-center cursor-pointer">
        {user ? (
          <DropdownMenu>
            {user?.is_premium === true ? (
              <Link href="/advanced-calc">
                <Button variant="main">Advanced Calculator</Button>
              </Link>
            ) : (
              <a href="#subcribe">
                <Button variant="main">Go Premium</Button>
              </a>
            )}
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 items-center">
                {user.user_metadata.picture ? (
                  <Image
                    className="rounded-full border-1 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
                    alt="profile_picture"
                    src={user?.user_metadata.picture}
                    width={45}
                    height={45}
                  />
                ) : (
                  <CircleUserRound
                    className="border-3 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
                    strokeWidth={0.7}
                    width={45}
                    height={45}
                  />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <CircleUserRound strokeWidth={1} />
                  View Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/account-settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings strokeWidth={1} />
                  Manage Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                <LogOutIcon strokeWidth={1} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/get-started">
            <Button variant={"main"}>Get Started</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
