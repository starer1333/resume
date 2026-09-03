import type { Metadata } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/caveat/400.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://how-i-see.pages.dev"),
  title: {
    default: "How I See — Wang Jinghan",
    template: "%s — How I See",
  },
  description: "Observing, feeling, remembering — a personal portfolio by Wang Jinghan.",
  openGraph: {
    title: "How I See — Wang Jinghan",
    description: "Observing, feeling, remembering — a personal portfolio by Wang Jinghan.",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "How I See — observing, feeling, remembering" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
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
