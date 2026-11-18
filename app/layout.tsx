import { PlayerProvider } from "@/components/player/PlayerProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { DevyyyyyProvider } from "@/components/support/DevyyyyyProvider";
import { APP_NAME } from "@/lib/branding";
import { siteMetadata, siteUrl } from "@/lib/site";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      {/* Extensions and automation tools inject attributes (e.g. a custom cursor) on <body> before hydration. */}
      <body className="min-h-full bg-canvas text-ink" suppressHydrationWarning>
        <ThemeProvider>
          <PlayerProvider>
            <DevyyyyyProvider>{children}</DevyyyyyProvider>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
