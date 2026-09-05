import type { Metadata } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/caveat/400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://byjinghan.com"),
  alternates: { canonical: "/" },
  title: {
    default: "Jinghan — Personal Archive",
    template: "%s — Jinghan",
  },
  description: "Observing, listening, and making — the personal visual archive of Wang Jinghan.",
  openGraph: {
    url: "/",
    title: "Jinghan — Personal Archive",
    description: "Observing, listening, and making — the personal visual archive of Wang Jinghan.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Jinghan — a personal archive in sound, image, and memory" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
