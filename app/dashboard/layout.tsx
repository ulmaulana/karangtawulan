"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/adminpanel?redirect=/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sea-foam/20 via-white to-sea-ocean/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sea-ocean mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sea-foam/20 via-white to-sea-ocean/10">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-4 pt-16 sm:p-6 md:p-8 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}