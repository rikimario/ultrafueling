"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { Card } from "./ui/card";
import { ExternalLink, FileText, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CURRENT_TERMS_VERSION } from "@/utils/terms";

export default function TermsModal() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function acceptTerms() {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        terms_accepted: true,
        privacy_accepted: true,
        terms_version: CURRENT_TERMS_VERSION,
        terms_accepted_at: new Date().toISOString(),
      },
    });

    if (!error) {
      window.location.reload();
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center text-center">
      <Card
        className={cn(
          "relative rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl flex flex-col items-center justify-center",
        )}
      >
        {/* Decorative top line */}
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />
        {/* Header and Icon*/}
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-lg bg-[#0080ff11] border-2 border-[#2b3b55]/95 flex items-center justify-center mb-4">
            <Shield
              className="mx-auto text-[#99CCFF]"
              size={60}
              strokeWidth={1}
            />
          </div>
          <h2 className="text-2xl font-bold">Before You Continue</h2>
          <p className="text-muted-foreground mt-2">
            Please review and accept our policies
          </p>
        </div>
        {/* Policy cards */}
        <div className="mb-4 space-y-3 w-full text-lefts">
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl bg-gray-800/50 p-4 ring-1 ring-gray-700/50 transition-all hover:bg-gray-800 hover:ring-blue-500/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Terms & Conditions</h3>
              <p className="text-sm text-gray-400">Read our terms of service</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-500" strokeWidth={1} />
          </Link>

          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl bg-gray-800/50 p-4 ring-1 ring-gray-700/50 transition-all hover:bg-gray-800 hover:ring-purple-500/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
              <Lock className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Privacy Policy</h3>
              <p className="text-sm text-gray-400">How we handle your data</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-500" strokeWidth={1} />
          </Link>
        </div>

        {/* Agreement text */}
        <p className="text-center text-sm text-gray-500">
          By clicking "I Agree", you confirm that you have read and accept both
          policies.
        </p>

        <Button
          onClick={acceptTerms}
          disabled={loading}
          variant={"secondary"}
          className={cn("w-full border-[#2b3b55]/95 hover:bg-[#2b3b55]/20")}
        >
          {loading ? "Saving..." : "I Agree"}
        </Button>
      </Card>
    </div>
  );
}
