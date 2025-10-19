import { Button } from "@/components/ui/button";
import { login, signInWithGoogle, signup } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  return (
    <section className="flex items-center justify-center mt-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="Login">
          <TabsList>
            <TabsTrigger value="Login">Login</TabsTrigger>
            <TabsTrigger value="Sign up">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <form>
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Sign in to you&apos;re account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-name">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="John@example.com"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tabs-demo-username">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="********"
                    />
                  </div>
                </CardContent>
                <CardFooter className={cn("flex flex-col gap-4")}>
                  <Button size={"lg"} formAction={login}>
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
            <form>
              <Card>
                <CardHeader>
                  <CardTitle>Sign up</CardTitle>
                  <CardDescription>
                    Create you&apos;ll new account
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="full_name">Username*</Label>
                    <Input id="full_name" type="text" name="full_name" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email*</Label>
                    <Input id="email" type="email" name="email" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password*</Label>
                    <Input id="password" type="password" name="password" />
                  </div>
                </CardContent>
                <CardFooter className={cn("flex flex-col gap-4")}>
                  <Button size={"lg"} formAction={signup}>
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
    </section>
  );
}
