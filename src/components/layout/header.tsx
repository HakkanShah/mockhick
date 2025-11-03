
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useState } from "react";

export function Header({ setIsSheetOpen }: { setIsSheetOpen: (isOpen: boolean) => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
       <div className="md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsSheetOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>
      <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
}
