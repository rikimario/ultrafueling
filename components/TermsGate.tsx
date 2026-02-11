"use client";

import TermsModal from "./TermsModal";
import { useUser } from "@/contexts/UserContext";
import { CURRENT_TERMS_VERSION } from "@/utils/terms";
import { usePathname } from "next/navigation";

export default function TermsGate() {
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) return null;

  const hasAcceptedTerms =
    user.terms_accepted === true &&
    user.privacy_accepted === true &&
    user.terms_version === CURRENT_TERMS_VERSION;

  const isLegalPage =
    pathname.startsWith("/accept-terms") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy-policy");

  if (hasAcceptedTerms || isLegalPage) return null;

  return <TermsModal />;
}
