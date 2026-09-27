import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
