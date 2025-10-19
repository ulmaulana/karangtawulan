"use client";

import { Geist, Geist_Mono, Parkinsans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatAssistant } from "@/components/chat-assistant";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/api/auth");

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parkinsans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {!isAdminRoute && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <ChatAssistant />}
        </ThemeProvider>
      </body>
    </html>
  );
}
