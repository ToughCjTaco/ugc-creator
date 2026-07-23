import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UGC Creator Studio",
  description: "Generate hyper-realistic AI UGC influencer content with custom actors and prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
