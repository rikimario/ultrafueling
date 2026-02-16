"use client";

import TermsModal from "./TermsModal";
import { useUser } from "@/contexts/UserContext";
import { CURRENT_TERMS_VERSION } from "@/utils/terms";
import { usePathname } from "next/navigation";

export default function TermsGate() {
  const { user } = useUser();
  const pathname = usePathname();

  // Don't show modal if no user
  if (!user) return null;

  // Check user metadata for terms acceptance
  const hasAcceptedTerms =
    user.user_metadata?.terms_accepted === true &&
    user.user_metadata?.privacy_accepted === true &&
    user.user_metadata?.terms_version === CURRENT_TERMS_VERSION;

  // Don't show modal on legal pages
  const isLegalPage =
    pathname.startsWith("/accept-terms") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy-policy");

  if (hasAcceptedTerms || isLegalPage) return null;

  return <TermsModal />;
}
