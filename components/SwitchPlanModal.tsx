import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch Subscription Plan?</DialogTitle>
          <DialogDescription>
            You'll be charged the prorated difference between your current plan
            and the new plan. Your billing cycle will remain the same.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2 sm:gap-0">
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
