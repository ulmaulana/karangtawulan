"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatAssistant } from "@/components/chat-assistant";
import { StructuredData } from "@/components/structured-data";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/api/auth");

  return (
    <>
      <StructuredData />
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
    </>
  );
}
