import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ChatBubble } from "@/components/chat-bubble";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Portofolio | Gaza Al Ghozali Chansa",
  description: "UnderGraduate Informatics Student",
  icons: {
    icon: "/icons/Icon_website.png",
    shortcut: "/icons/Icon_website.png",
    apple: "/icons/Icon_website.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${spaceMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <SmoothScroll>
          {children}
          <ChatBubble />
        </SmoothScroll>
      </body>
    </html>
  );
}
