import { MountainSnow } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function WhoIsItFor() {
  return (
    <div className="p-12">
      <h3 className="mt-10 mb-4">
        <div
          className={`flex items-center gap-3 px-4 py-2 font-bold text-xl
      `}
        >
          <MountainSnow strokeWidth={0.7} fill="#6a7282" className="w-6 h-6" />
          Who <span className="text-emerald-500">UltraFueling</span> is for?
        </div>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={cn(
            "p-4 flex flex-row border-gray-500 hover:border-gray-600 cursor-pointer"
          )}
        >
          <Image
            src="/long-distance-people-jogging.jpg"
            alt="marathon"
            width={500}
            height={500}
            className={cn("w-1/2 object-cover")}
          />
          <div>
            <CardTitle className="text-xl md:text-2xl">
              You race long distances
            </CardTitle>
            <CardContent className={cn("p-0")}>
              <p className="mt-2 text-lg text-muted-foreground">
                Marathons, ultras, trail races, stage races
              </p>
            </CardContent>
          </div>
        </Card>
        <Card
          className={cn(
            "p-4 flex flex-row border-gray-500 hover:border-gray-600 cursor-pointer"
          )}
        >
          <Image
            src="/trail.jpg"
            alt="marathon"
            width={500}
            height={500}
            className={cn("w-1/2 object-cover")}
          />
          <div>
            <CardTitle className="text-xl md:text-2xl">
              Your races aren’t flat or predictable
            </CardTitle>
            <CardContent className={cn("p-0")}>
              <p className="mt-2 text-lg text-muted-foreground">
                Trail, elevation, heat, cold, or technical terrain
              </p>
            </CardContent>
          </div>
        </Card>
        <Card
          className={cn(
            "p-4 flex flex-row border-gray-500 hover:border-gray-600 cursor-pointer"
          )}
        >
          <Image
            src="/hydration3.jpg"
            alt="marathon"
            width={500}
            height={500}
            className={cn("w-1/2 object-cover")}
          />
          <div>
            <CardTitle className="text-xl md:text-2xl">
              You struggle with hydration or cramping
            </CardTitle>
            <CardContent className={cn("p-0")}>
              <p className="mt-2 text-lg text-muted-foreground">
                Trail, elevation, heat, cold, or technical terrain
              </p>
            </CardContent>
          </div>
        </Card>
        <Card
          className={cn(
            "p-4 flex flex-row border-gray-500 hover:border-gray-600 cursor-pointer"
          )}
        >
          <Image
            src="/data-fueling.png"
            alt="marathon"
            width={500}
            height={500}
            className={cn("w-1/2 object-cover")}
          />
          <div>
            <CardTitle className="text-xl md:text-2xl">
              You want data, not guesswork
            </CardTitle>
            <CardContent className={cn("p-0")}>
              <p className="mt-2 text-lg text-muted-foreground">
                Science-based fueling instead of “take a gel every hour”
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
