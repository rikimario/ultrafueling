export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
        {children}
      </div>
    </section>
  );
}
