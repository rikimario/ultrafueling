import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function WhoIsItFor() {
  return (
    <div className="relative py-20">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[600px] bg-[#0080ff11] blur-3xl rounded-full" />
      </div>
      <div className="text-center my-10 space-y-4">
        <h1 className="font-bold text-4xl">
          Who is <span className="text-emerald-500">UltraFueling</span> for?
        </h1>
        <p className="text-muted-foreground text-center text-xl max-w-2xl mx-auto">
          UltraFueling is built for endurance athletes who want a smarter, more
          reliable way to fuel - no guesswork, no generic advice.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className={cn("relative p-4 flex flex-row border-gray-500")}>
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />

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
        <Card className={cn("relative p-4 flex flex-row border-gray-500")}>
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />

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
        <Card className={cn("relative p-4 flex flex-row border-gray-500")}>
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />

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
        <Card className={cn("relative p-4 flex flex-row border-gray-500")}>
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />

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
