"use client";

import { ErrorState } from "@/components/ui/States";

export default function PlayError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState message={error.message || "This page could not be loaded."} onRetry={reset} />;
}
