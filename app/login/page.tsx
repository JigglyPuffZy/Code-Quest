import { AuthScreen } from "@/components/auth/AuthScreen";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthScreen mode="login" />
    </Suspense>
  );
}
