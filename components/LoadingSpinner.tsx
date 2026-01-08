import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900/1 via-gray-800/1 to-gray-900/1 backdrop-blur-sm rounded-2xl">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-md animate-pulse" />
        </div>
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-muted/20"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        <div
          className="absolute inset-2 w-12 h-12 rounded-full border-2 border-transparent border-t-primary/50 animate-spin"
          style={{
            animationDirection: "reverse",
            animationDuration: "1.5s",
          }}
        ></div>
      </div>
      {/* Text */}
      <div className="mt-10 text-center space-y-4">
        <p className="text-lg font-medium">Building your fueling plan…</p>
        <p className="text-muted-foreground">
          Calculating nutrition + generating AI strategy
        </p>
      </div>
    </div>
  );
}
