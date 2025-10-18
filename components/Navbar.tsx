import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between border-b p-4 mb-4">
      <span>UltraFueling</span>
      <div className="space-x-4">
        <Link href="/get-started">
          <Button className={cn("bg-indigo-500 hover:bg-indigo-600")}>
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
