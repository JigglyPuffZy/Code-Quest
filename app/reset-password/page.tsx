import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
