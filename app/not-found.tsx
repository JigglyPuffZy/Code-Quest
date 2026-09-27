import { Logo } from "@/components/shell/Logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      <div className="app-backdrop pointer-events-none fixed inset-0" />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">This page doesn&apos;t exist in the academy.</p>
        <Link href="/dashboard" className="mt-6 inline-flex w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-canvas hover:bg-amber">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
