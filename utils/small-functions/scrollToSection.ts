import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function scrollToSection(
  id: string,
  pathname: string,
  router: AppRouterInstance,
) {
  if (pathname !== "/") {
    router.push(`/#${id}`);
    return;
  }

  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    window.history.replaceState({}, "", `/#${id}`);
  }, 100);
}
