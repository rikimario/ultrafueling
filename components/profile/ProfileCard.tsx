import { Card } from "../ui/card";
import Image from "next/image";
import { Calendar, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { ProfileCardSkeleton } from "../skeletions";

export default function ProfileCard({ loading }: { loading: boolean }) {
  const { user, avatarUrl } = useUser();
  const stats: { memberSince: string } = {
    memberSince: new Date(user?.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  if (loading) {
    return <ProfileCardSkeleton />;
  }

  return (
    <Card className="col-span-1 max-h-96 min-h-[400px] rounded-2xl p-6 shadow-md md:w-full">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="profile_picture"
          width={200}
          height={200}
          className="mx-auto mb-4 h-32 w-32 cursor-pointer rounded-full border-3 border-gray-500 object-cover transition duration-300 ease-in-out hover:border-[#a3ea2a]"
          priority
        />
      ) : (
        <UserRound
          className="mx-auto mb-4 h-32 w-32 rounded-full border-3 border-gray-500 transition duration-300 ease-in-out hover:border-[#a3ea2a]"
          strokeWidth={0.3}
          width={100}
          height={100}
        />
      )}
      <div className="text-center">
        <p className="mb-2 text-2xl font-semibold">
          {user?.user_metadata.full_name}
        </p>
        <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
          <Mail width={15} height={15} /> {user?.email}
        </p>
        <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1 text-sm">
          <Calendar width={14} height={14} />
          Member since {stats.memberSince}
        </p>
      </div>

      <Link href="/account-settings">
        <Button variant={"main"} className={cn("w-full")}>
          Edit Profile
        </Button>
      </Link>
    </Card>
  );
}
