import { CardContent } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { ADVANCED_FORM_DEFAULTS } from "@/utils/calculator/formDefaults";

interface Props {
  form: typeof ADVANCED_FORM_DEFAULTS;
  handleChange: (
    field: keyof typeof ADVANCED_FORM_DEFAULTS,
    value: string
  ) => void;
}

export default function CalcAdvanceInfo({ form, handleChange }: Props) {
  return (
    <CardContent
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3")}
    >
      <div className="space-y-2">
        <Label className={cn("px-1")}>Terrain</Label>
        <Select
          value={form.terrain}
          onValueChange={(value) =>
            handleChange("terrain", value as "flat" | "rolling" | "mountain")
          }
        >
          <SelectTrigger className={cn("w-full")}>
            <SelectValue placeholder="Select a terrain type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Terrain type</SelectLabel>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="rolling">Rolling</SelectItem>
              <SelectItem value="mountain">Mountain</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {form.terrainError && (
          <p className="text-destructive text-xs ml-2">{form.terrainError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Pack weight (<span className="text-[#99CCFF]">kg</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter pack weight"
          value={form.packWeightKg}
          onChange={(e) => handleChange("packWeightKg", e.target.value)}
        />
        {form.packWeightKgError && (
          <p className="text-destructive text-xs ml-2">
            {form.packWeightKgError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Sweat rate (<span className="text-[#99CCFF]">L/hour</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter sweat rate"
          value={form.sweatRateLPerHour}
          onChange={(e) => handleChange("sweatRateLPerHour", e.target.value)}
        />
        {form.sweatRateLPerHourError && (
          <p className="text-destructive text-xs ml-2">
            {form.sweatRateLPerHourError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>Goal</Label>
        <Select
          value={form.goal}
          onValueChange={(value) =>
            handleChange("goal", value as "finish" | "performance")
          }
        >
          <SelectTrigger className={cn("w-full")}>
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Goal</SelectLabel>
              <SelectItem value="finish">Finish</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {form.goalError && (
          <p className="text-destructive text-xs ml-2">{form.goalError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>Aid stations</Label>
        <Input
          value={form.hasAidStations}
          type="number"
          placeholder="Enter aid stations"
          onChange={(e) => handleChange("hasAidStations", e.target.value)}
        />
        {form.hasAidStationsError && (
          <p className="text-destructive text-xs ml-2">
            {form.hasAidStationsError}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className={cn("px-1")}>
          Aid station gap (<span className="text-[#99CCFF]">hours</span>)
        </Label>
        <Input
          type="number"
          placeholder="Enter aid station gap"
          value={form.aidStationGapHours}
          onChange={(e) => handleChange("aidStationGapHours", e.target.value)}
        />
        {form.aidStationGapHoursError && (
          <p className="text-destructive text-xs ml-2">
            {form.aidStationGapHoursError}
          </p>
        )}
      </div>
    </CardContent>
  );
}
