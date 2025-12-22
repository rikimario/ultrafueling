import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        `
        relative w-[220px]
        rounded-xl
        border border-white/20 dark:border-white/10
        bg-white/10 dark:bg-transparent
        backdrop-blur-[1px]
        shadow-lg shadow-emerald-500/30
        overflow-hidden
        `,
        className
      )}
    >
      <GlassHighlight />
      {children}
    </Card>
  );
}

function GlassHighlight() {
  return (
    <div className="absolute inset-0 bg-transparent pointer-events-none" />
  );
}
