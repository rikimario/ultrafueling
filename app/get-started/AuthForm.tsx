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
import { useActionState, useEffect } from "react";
import { login, signInWithGoogle, signup } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [loginState, loginAction, isLoginPending] = useActionState(login, {
    error: "",
  });
  const [signupState, signupAction, isSignupPending] = useActionState(signup, {
    error: "",
  });

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
        router.push("/");
        router.refresh();
      }, 300);
    }
  }, [signupState, router]);

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
                  onClick={signInWithGoogle}
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
          <form action={signupAction}>
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
                  <Label htmlFor="full_name">Username*</Label>
                  <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    autoComplete="name"
                    disabled={isSignupPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-email">Email*</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    disabled={isSignupPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="signup-password">Password*</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    disabled={isSignupPending}
                  />
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
                  onClick={signInWithGoogle}
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
