
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MockHickIcon } from "@/components/icons";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router, isHydrated]);

  if (!isHydrated || loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 animate-attention-ring">
            <MockHickIcon className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/40 text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header setIsSheetOpen={setIsSheetOpen} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
