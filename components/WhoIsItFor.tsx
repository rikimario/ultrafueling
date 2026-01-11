import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { data } from "@/lib/whoIsItFor";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:px-10 max-w-5xl mx-auto gap-4">
        {data.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className={cn(
                "relative flex flex-row min-h-36 gap-6 p-4 border-gray-500"
              )}
            >
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CCFF] to-transparent]" />

              <div className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center">
                <Icon className="w-18 h-18 text-[#99CCFF]" strokeWidth={0.5} />
              </div>

              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl">
                  {item.title}
                </CardTitle>
                <CardContent className={cn("p-0")}>
                  <p className="mt-2 lg:text-lg text-muted-foreground">
                    {item.text}
                  </p>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
