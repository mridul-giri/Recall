import type { Metadata } from "next";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui";
import { Winky_Rough } from "next/font/google";

const averia = Winky_Rough({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-averia",
});

export const metadata: Metadata = {
  title: "Recall",
  description:
    "Save and manage your links, images, videos, and documents efficiently from Telegram and the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${averia.className} primary-bg`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
