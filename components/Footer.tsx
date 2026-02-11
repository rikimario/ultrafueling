"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { useProfile } from "@/hooks/useProfile";

export default function Footer() {
  // const { user } = useUser();
  const { profile } = useProfile();
  return (
    <footer className="border-border mt-20 border-t bg-[#212c42]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
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
          <h4 className="mb-3 font-semibold text-gray-200">Product</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="pb-2 hover:text-gray-300">
              <Link href="/#freeCalc">Free Calculator</Link>
            </li>
            <li className="pb-2 hover:text-gray-300">
              <Link href="/#howItWorks">How It Works</Link>
            </li>
            <li className="pb-2 hover:text-gray-300">
              <Link href="/#subscribe">Pricing</Link>
            </li>
          </ul>
        </div>

        <div>
          {/* Company */}
          <h4 className="mb-3 font-semibold text-gray-200">Company</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="pb-2 hover:text-gray-300">
              <Link href="/#faq">FAQ</Link>
            </li>
            <li className="pb-2 hover:text-gray-300">
              <Link href="/contact">Contact</Link>
            </li>
            <li className="pb-2 hover:text-gray-300">
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="pb-2 hover:text-gray-300">
              <Link href="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="mb-3 font-semibold text-gray-200">Get Started</h4>
          <p className="text-muted-foreground mb-4 text-sm">
            Build your fueling plan in minutes.
          </p>
          {profile ? (
            profile?.subscription_status === "active" ||
            profile?.subscription_status === "trialing" ? (
              <Link href="/advanced-calc">
                <Button
                  className="w-full text-gray-800 hover:text-white"
                  variant="main"
                >
                  Advanced Calculator
                </Button>
              </Link>
            ) : (
              <Link href="/#subscribe">
                <Button
                  className="w-full text-gray-800 hover:text-white"
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

      <div className="text-muted-foreground border-border border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} UltraFueling. All rights reserved.
      </div>
    </footer>
  );
}
