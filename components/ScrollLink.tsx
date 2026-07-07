"use client";

import { usePathname, useRouter } from "next/navigation";

interface ScrollLinkProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollLink({
  id,
  children,
  className,
}: ScrollLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Optional: keep the URL in sync
      window.history.replaceState({}, "", `/#${id}`);
    }
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
}
