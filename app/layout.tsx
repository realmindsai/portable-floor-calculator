import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://realmindsai.github.io/portable-floor-calculator/"),
  title: "Portable Floor Calculator | Portable Floors",
  description: "Calculate the most efficient Nice & Easy portable dance floor layout for any rectangular room.",
  openGraph: {
    title: "Plan the floor. Not the faff.",
    description: "Calculate and draw the most efficient Nice & Easy portable dance floor layout.",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Portable Floor Calculator panel layout" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan the floor. Not the faff.",
    description: "Calculate and draw the most efficient portable dance floor layout.",
    images: ["og.png"],
  },
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
