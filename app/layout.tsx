import { PlayerProvider } from "@/components/player/PlayerProvider";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const code = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: {
    default: "CodeQuest",
    template: "%s · CodeQuest",
  },
  description:
    "Learn Python and JavaScript through lessons, quests, and coding challenges — a calm, focused coding academy.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${code.variable} h-full antialiased`}>
      <body className="min-h-full">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
