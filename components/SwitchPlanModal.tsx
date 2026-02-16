import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Sparkles } from "lucide-react";

export default function SwitchPlanModal({
  showConfirmModal,
  setShowConfirmModal,
  proceedWithSubscription,
  submitting,
}: {
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  proceedWithSubscription: () => void;
  submitting: boolean;
}) {
  return (
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900",
        )}
      >
        <DialogHeader className={cn("text-center sm:text-center")}>
          <div className="bg-primary/10 ring-primary/20 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ring-1">
            <Sparkles className="text-primary h-7 w-7" />
          </div>
          <DialogTitle className={cn("text-xl font-bold")}>
            Switch Subscription Plan?
          </DialogTitle>
          <DialogDescription className={cn("text-muted-foreground mt-2")}>
            You'll be charged the prorated difference between your current plan
            and the new plan. Your billing cycle will remain the same.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter
          className={cn("mt-2 flex flex-col gap-2 sm:flex-col sm:gap-2")}
        >
          <Button
            variant="main"
            onClick={proceedWithSubscription}
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Confirm Switch"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConfirmModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
