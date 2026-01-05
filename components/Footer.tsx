import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-[#212c42]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/">
            <Image
              src="/ultra-fueling-logo.svg"
              alt="logo"
              width={80}
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
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Free Calculator</li>
            <li>How It Works</li>
            <li>Pricing</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>FAQ</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="font-semibold mb-3">Get Started</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Build your fueling plan in minutes.
          </p>
          <Link href="/#freeCalc">
            <Button variant="main">Try Free Calculator</Button>
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
        © {new Date().getFullYear()} UltraFueling. All rights reserved.
      </div>
    </footer>
  );
}
