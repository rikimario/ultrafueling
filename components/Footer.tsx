"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

export default function Footer() {
  const { user } = useUser();
  return (
    <footer className="border-t border-border mt-20 bg-[#212c42]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/">
            <Image
              src="/ultra-fueling-logo.svg"
              alt="logo"
              width={140}
              height={40}
              priority
              className=""
            />
          </Link>
          <p className="text-muted-foreground text-sm">
            Science-based fueling plans for endurance athletes.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-200">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-gray-300 pb-2">
              <Link href="/#freeCalc">Free Calculator</Link>
            </li>
            <li className="hover:text-gray-300 pb-2">
              <Link href="/#howItWorks">How It Works</Link>
            </li>
            <li className="hover:text-gray-300 pb-2">
              <Link href="/#subscribe">Pricing</Link>
            </li>
          </ul>
        </div>

        <div>
          {/* Company */}
          <h4 className="font-semibold mb-3 text-gray-200">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-gray-300 pb-2">
              <Link href="/#faq">FAQ</Link>
            </li>
            <li className="hover:text-gray-300 pb-2">
              <Link href="/contact">Contact</Link>
            </li>
            <li className="hover:text-gray-300 pb-2">
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="hover:text-gray-300 pb-2">
              <Link href="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-200">Get Started</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Build your fueling plan in minutes.
          </p>
          {user ? (
            user?.is_premium === true ? (
              <Link href="/advanced-calc">
                <Button
                  className="hover:text-white text-gray-800 w-full"
                  variant="main"
                >
                  Advanced Calculator
                </Button>
              </Link>
            ) : (
              <Link href="/#subscribe">
                <Button
                  className="hover:text-white text-gray-800 w-full"
                  variant="main"
                >
                  Go Premium
                </Button>
              </Link>
            )
          ) : (
            <Link href="/get-started">
              <Button className="w-full" variant={"main"}>
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © {new Date().getFullYear()} UltraFueling. All rights reserved.
      </div>
    </footer>
  );
}
