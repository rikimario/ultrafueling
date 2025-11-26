"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { logout } from "@/app/get-started/actions";
import Image from "next/image";
import { CircleUserRound, LogOutIcon, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
  const { user, avatarUrl } = useUser();
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
                {avatarUrl ? (
                  <Image
                    className="w-14 h-14 rounded-full border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out object-cover"
                    alt="profile_picture"
                    src={avatarUrl}
                    width={200}
                    height={200}
                    priority
                  />
                ) : (
                  <UserRound
                    className="rounded-full border-3 border-gray-500 hover:border-[#a3ea2a] transition duration-300 ease-in-out"
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
