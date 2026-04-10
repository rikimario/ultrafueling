"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedbackPage() {
  const { user } = useUser();
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send feedback");
      }

      toast.success("Feedback sent successfully! We'll get back to you soon.");

      // Reset form
      setSubject("");
      setMessage("");
      if (!user) {
        setName("");
        setEmail("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <MessageSquare className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            We'd Love Your Feedback
          </h1>
          <p className="text-muted-foreground text-lg">
            Help us improve UltraFueling. Share your thoughts, suggestions, or
            report any issues.
          </p>
        </div>

        {/* Feedback Form Card */}
        <Card className="relative overflow-hidden">
          {/* Decorative top line */}
          <span className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent" />

          <CardHeader>
            <CardTitle className="text-2xl">Send Us Your Feedback</CardTitle>
            <CardDescription className="text-base">
              All fields marked with <span className="text-destructive">*</span>{" "}
              are required
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name{" "}
                  {!user && (
                    <span className="text-muted-foreground">(optional)</span>
                  )}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!user}
                  className={cn(user && "bg-muted")}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!user}
                  className={cn(user && "bg-muted")}
                />
                {user && (
                  <p className="text-muted-foreground text-xs">
                    Using your account email
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Brief summary of your feedback"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="resize-none"
                />
                <p className="text-muted-foreground text-xs">
                  {message.length} / 2000 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || !email || !message}
                className="w-full"
                variant="main"
              >
                {submitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
