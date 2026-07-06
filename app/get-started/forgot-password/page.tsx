"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="relative w-full max-w-md overflow-hidden">
        <span className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent" />

        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {sent ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="text-primary h-8 w-8" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {sent ? "Check Your Email" : "Forgot Password?"}
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {sent
              ? `We've sent a password reset link to `
              : "Enter your email address and we'll send you a link to reset your password."}
            {sent && <strong className="text-foreground">{email}</strong>}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && <p className="text-sm text-red-500">⚠️ {error}</p>}

              <Button
                type="submit"
                variant="main"
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Link href="/get-started">
                <Button variant="ghost" className="w-full gap-2" type="button">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="border-muted-foreground/30 bg-muted/20 text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
                ⚠️ Don't see the email? Check your <strong>spam folder</strong>.
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Try a different email
              </Button>

              <Link href="/get-started">
                <Button variant="ghost" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
