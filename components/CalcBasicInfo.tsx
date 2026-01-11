import { CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { ADVANCED_FORM_DEFAULTS } from "@/utils/calculator/formDefaults";

interface Props {
  form: typeof ADVANCED_FORM_DEFAULTS;
  handleChange: (
    field: keyof typeof ADVANCED_FORM_DEFAULTS,
    value: string
  ) => void;
}

export default function CalcBasicInfo({ form, handleChange }: Props) {
  return (
    <CardContent
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3")}
    >
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Distance (<span className="text-[#99CCFF]">km</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter distance"
          value={form.distanceKm}
          onChange={(e) => handleChange("distanceKm", e.target.value)}
        />
        {form.distanceKmError && (
          <p className="text-destructive text-xs ml-2">
            {form.distanceKmError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Duration (<span className="text-[#99CCFF]">hours</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter estimated duration"
          value={form.durationHours}
          onChange={(e) => handleChange("durationHours", e.target.value)}
        />
        {form.durationHoursError && (
          <p className="text-destructive text-xs ml-2">
            {form.durationHoursError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Weight (<span className="text-[#99CCFF]">kg</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter your weight"
          value={form.weightKg}
          onChange={(e) => handleChange("weightKg", e.target.value)}
        />
        {form.weightKgError && (
          <p className="text-destructive text-xs ml-2">{form.weightKgError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Temperature (<span className="text-[#99CCFF]">°C</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter temperature"
          value={form.temperatureC}
          onChange={(e) => handleChange("temperatureC", e.target.value)}
        />
        {form.temperatureCError && (
          <p className="text-destructive text-xs ml-2">
            {form.temperatureCError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>Experience level</Label>
        <Select
          value={form.experienceLevel}
          onValueChange={(value) => handleChange("experienceLevel", value)}
        >
          <SelectTrigger className={cn("w-full")}>
            <SelectValue placeholder="Select an experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Experience level</SelectLabel>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Elite">Elite</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {form.experienceLevelError && (
          <p className="text-destructive text-xs ml-2">
            {form.experienceLevelError}
          </p>
        )}
      </div>
    </CardContent>
  );
}
