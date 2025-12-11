import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export default function PrefCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <>
      <Checkbox
        id="pref-autofill"
        checked={checked}
        onCheckedChange={(checked) => onChange(Boolean(checked))}
      />
      <Label htmlFor="pref-autofill" className={cn("px-1 text-sm")}>
        Auto fill profile preferences for weight, sweat rate, experience level
        and goal
      </Label>
    </>
  );
}
