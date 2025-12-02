"use client";

import { deleteAccount } from "@/app/get-started/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    const result = await deleteAccount();

    if (result?.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Account deleted successfully");

      window.location.href = "/";
    }
  };
  return (
    <section className="w-full py-16">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-white py-4">
        <span>
          <CircleAlert color="red" />
        </span>{" "}
        Delete your account
      </h1>
      <p className="pb-10 w-2/3">
        Deleting your account is permanent. All personal data, saved plans, and
        preferences will be permanently erased and cannot be recovered. Any
        active subscriptions will also be canceled. Please make sure you have
        exported anything important before continuing.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant={"destructive"}>
            Delete My Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
