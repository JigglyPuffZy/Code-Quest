import { PlayerProvider } from "@/components/player/PlayerProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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
    default: "Code Quest",
    template: "%s · Code Quest",
  },
  description:
    "Read coding guides, complete quests, and practice in Arena and Game mode — a calm, focused coding academy.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${code.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-canvas text-ink">
        <Script id="codequest-theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("codequest-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`}
        </Script>
        <ThemeProvider>
          <PlayerProvider>{children}</PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
