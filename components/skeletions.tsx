import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

///// PROFILE SKELETONS /////
export function SubscriptionSkeleton() {
  return (
    <Card className="min-h-[350px] space-y-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-28" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="mx-auto h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-full" />
          </div>

          <div className="mt-8 space-y-2">
            <Skeleton className="h-9 w-full rounded" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickStatsSkeleton() {
  const array = new Array(3).fill(null);
  return (
    <Card className="mt-4 rounded-2xl shadow-md md:mt-0 md:w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 font-semibold">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-24" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {array.map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="flex h-5 items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </span>
            <span className="h-5 font-semibold">
              <Skeleton className="h-5 w-8" />
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProfileCardSkeleton() {
  return (
    <Card className="col-span-1 max-h-96 min-h-[400px] rounded-2xl p-6 shadow-md md:w-full">
      {/* Avatar skeleton */}
      <Skeleton className="mx-auto mb-4 h-32 w-32 rounded-full" />

      {/* Text content skeleton */}
      <div className="space-y-2 text-center">
        {/* Name skeleton */}
        <Skeleton className="mx-auto h-7 w-40" />

        {/* Email skeleton */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Member since skeleton */}
        <div className="mt-2 flex items-center justify-center gap-1">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="mt-4 h-10 w-full rounded" />
    </Card>
  );
}

// ************************** //
