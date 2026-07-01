import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="relative w-full max-w-md overflow-hidden">
        <span className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent" />

        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Mail className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="mt-2 text-base">
            We've sent a confirmation link to{" "}
            {email ? (
              <strong className="text-foreground">{email}</strong>
            ) : (
              "your email address"
            )}
            .
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            Click the link in the email to verify your account and get started.
            Don't forget to check your spam folder!
          </p>

          <div className="pt-4">
            <Link href="/get-started">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
