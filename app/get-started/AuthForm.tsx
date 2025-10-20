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
import React, { useActionState } from "react";
import { login, signInWithGoogle, signup } from "./actions";

export default function AuthForm() {
  const [loginState, loginAction] = useActionState(login, { error: "" });
  const [signupState, signupAction] = useActionState(signup, { error: "" });
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="Login">
        <TabsList>
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="Sign up">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <form action={loginAction}>
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Sign in to you&apos;re account.
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
                    placeholder="John@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    autoComplete="password"
                  />
                </div>
              </CardContent>
              <CardFooter className={cn("flex flex-col gap-4")}>
                <Button size={"lg"} type="submit">
                  Login
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-full")}
                  onClick={signInWithGoogle}
                >
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
                <CardDescription>
                  Create you&apos;ll new account
                </CardDescription>
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
                    autoComplete="text"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password*</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="password"
                  />
                </div>
              </CardContent>
              <CardFooter className={cn("flex flex-col gap-4")}>
                <Button size={"lg"} type="submit">
                  Sign up
                </Button>
                <Button
                  variant={"outline"}
                  className={cn("w-full")}
                  onClick={signInWithGoogle}
                >
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
