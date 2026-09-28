import { PlayerProvider } from "@/components/player/PlayerProvider";
import { APP_NAME } from "@/lib/branding";
import { siteMetadata, siteUrl } from "@/lib/site";
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

const baseUrl = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: siteMetadata.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: APP_NAME,
    title: APP_NAME,
    description: siteMetadata.description,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: siteMetadata.description,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${code.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
