"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { logout } from "@/app/get-started/actions";
import Image from "next/image";
import {
  CircleUserRound,
  LogOutIcon,
  MoonIcon,
  Settings,
  UserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Navbar({}: {}) {
  const { user, avatarUrl } = useUser();
  const darkMode = useDarkMode();

  return (
    <nav className="bg-[#212c42] md:px-4 pt-2">
      <div className="flex justify-between items-center max-w-[1320px] mx-auto px-6">
        <Link href="/">
          <Image
            src="/ultra-fueling-logo.svg"
            alt="logo"
            width={90}
            height={40}
            priority
          />
        </Link>
        <div className="space-x-4 flex justify-center items-center cursor-pointer">
          {user ? (
            <DropdownMenu>
              {user?.is_premium === true ? (
                <Link href="/advanced-calc">
                  <Button
                    className="hover:text-white hidden md:block text-gray-800"
                    variant="main"
                  >
                    Advanced Calculator
                  </Button>
                </Link>
              ) : (
                <Link href="/#subscribe">
                  <Button
                    className="hover:text-white text-gray-800"
                    variant="main"
                  >
                    Go Premium
                  </Button>
                </Link>
              )}
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex gap-2 items-center cursor-pointer"
                >
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem
                    className={cn(
                      "flex items-center cursor-pointer font-semibold text-[16px]"
                    )}
                  >
                    <CircleUserRound strokeWidth={2} />
                    View Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/account-settings">
                  <DropdownMenuItem
                    className={cn(
                      "flex items-center cursor-pointer font-semibold text-[16px]"
                    )}
                  >
                    <Settings strokeWidth={2} />
                    Manage Account
                  </DropdownMenuItem>
                </Link>
                {user?.is_premium === true ? (
                  <Link href="/advanced-calc">
                    <DropdownMenuItem
                      className={cn(
                        "flex items-center cursor-pointer md:hidden font-semibold text-[16px]"
                      )}
                    >
                      <Button
                        className="hover:text-white md:hidden block w-full text-gray-800"
                        variant="main"
                      >
                        Advanced Calculator
                      </Button>
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <Link href="/#subscribe">
                    <DropdownMenuItem
                      className={cn(
                        "flex items-center cursor-pointer md:hidden font-semibold text-[16px]"
                      )}
                    >
                      <Button
                        className="hover:text-white md:hidden block w-full text-gray-800"
                        variant="main"
                      >
                        Go Premium
                      </Button>
                    </DropdownMenuItem>
                  </Link>
                )}

                <div className="flex items-center justify-between cursor-pointer font-semibold px-2 pt-1.5 pb-3 border-b border-gray-200">
                  <Label className={cn("text-[16px]")}>
                    <MoonIcon
                      className="text-muted-foreground"
                      size={20}
                      strokeWidth={2}
                    />
                    Dark Mode
                  </Label>
                  <Switch onCheckedChange={darkMode.toggleDarkMode} />
                </div>

                <DropdownMenuItem
                  className={cn(
                    "flex items-center cursor-pointer font-semibold text-[16px]"
                  )}
                  onClick={logout}
                >
                  <LogOutIcon strokeWidth={2} />
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
      </div>
    </nav>
  );
}
