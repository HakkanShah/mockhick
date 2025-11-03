
"use client";

import Link from "next/link";
import { MockHickIcon } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/20 animated-gradient"></div>
      
      <div className="container relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-0">
        
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <MockHickIcon className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold tracking-tighter">MockHick</span>
            </Link>
          </div>
          
          <div className="relative rounded-xl border border-border/20 bg-card/60 p-4 shadow-2xl backdrop-blur-lg sm:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
