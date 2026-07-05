"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useActionState, useEffect, useState } from "react";
import { login, signup } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm() {
  const router = useRouter();
  const [loginState, loginAction, isLoginPending] = useActionState(login, {
    error: "",
  });
  const [signupState, signupAction, isSignupPending] = useActionState(signup, {
    error: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.elements.namedItem("confirm_password") as HTMLInputElement
    )?.value;

    if (password !== confirmPassword) {
      e.preventDefault();
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");
  };

  // Handle successful login
  useEffect(() => {
    if ((loginState as any).success) {
      // Wait a moment for auth state to propagate
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 300);
    }
  }, [loginState, router]);

  // Handle successful signup
  useEffect(() => {
    if ((signupState as any).success) {
      console.log("✅ Signup success detected, navigating...");
      setTimeout(() => {
        router.push(
          `/get-started/check-email?email=${encodeURIComponent((signupState as any).email)}`,
        );
        router.refresh();
      }, 300);
    }
  }, [signupState, router]);

  async function signInWithGoogle() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    // signInWithOAuth with PKCE returns a URL — navigate the browser there
    if (data?.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="flex min-h-screen w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="Login">
        <TabsList>
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="Sign up">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <form action={loginAction}>
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account.
                </CardDescription>
                {loginState.error && (
                  <p className="text-sm text-red-600">{loginState.error}</p>
                )}
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    disabled={isLoginPending}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href={"/reset-password-form"}>
                      <Button variant={"link"} size={"default"} type="button">
                        Forgot your password?
                      </Button>
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    autoComplete="current-password"
                    disabled={isLoginPending}
                  />
                </div>
              </CardContent>
              <CardFooter className={cn("flex flex-col gap-4")}>
                <Button
                  variant={"secondary"}
                  className={cn("w-full")}
                  size={"lg"}
                  type="submit"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-full bg-gray-200 dark:bg-gray-600")}
                  onClick={() => signInWithGoogle()}
                  type="button"
                  disabled={isLoginPending}
                >
                  <Image
                    src="/google-svg.svg"
                    width={20}
                    height={20}
                    alt="google"
                  />
                  Sign in with Google
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="Sign up">
          <form action={signupAction} onSubmit={handleSignupSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Create your new account</CardDescription>
                {signupState.error && (
                  <p className="text-sm text-red-600">{signupState.error}</p>
                )}
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label className={cn("gap-1")} htmlFor="full_name">
                    Username<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    autoComplete="name"
                    disabled={isSignupPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Label className={cn("gap-1")} htmlFor="signup-email">
                    Email<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    disabled={isSignupPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Label className={cn("gap-1")} htmlFor="signup-password">
                    Password<span className="text-red-400">*</span>
                  </Label>
                  <div className="relative w-full">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      disabled={isSignupPending}
                      onChange={() => setPasswordError("")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label
                    className={cn("gap-1")}
                    htmlFor="confirm-signup-password"
                  >
                    Confirm Password<span className="text-red-400">*</span>
                  </Label>
                  <div className="relative w-full">
                    <Input
                      id="confirm-signup-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      autoComplete="new-password"
                      disabled={isSignupPending}
                      className={cn(
                        "pr-10",
                        passwordError &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                      onChange={() => setPasswordError("")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className={cn("flex flex-col gap-4")}>
                <p className="text-muted-foreground mt-3 text-xs">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-sm underline hover:text-white"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-sm underline hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <Button
                  variant={"main"}
                  className={cn("w-full")}
                  size={"lg"}
                  type="submit"
                  disabled={isSignupPending}
                >
                  {isSignupPending ? "Signing up..." : "Sign up"}
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-full bg-gray-200 dark:bg-gray-600")}
                  onClick={() => signInWithGoogle()}
                  type="button"
                  disabled={isSignupPending}
                >
                  <Image
                    src="/google-svg.svg"
                    width={20}
                    height={20}
                    alt="google"
                  />
                  Sign in with Google
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
