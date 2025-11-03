
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockHickIcon } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/interview/new", icon: PlusSquare, label: "New Interview" },
  { href: "/history", icon: History, label: "History" },
];

type SidebarProps = {
    isSheetOpen: boolean;
    setIsSheetOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isSheetOpen, setIsSheetOpen }: SidebarProps) {
  const pathname = usePathname();

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className="justify-start"
          asChild
          onClick={() => inSheet && setIsSheetOpen(false)}
        >
          <Link href={item.href}>
            <item.icon className="mr-1 h-5 w-5 text-primary" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar in Sheet */}
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="left" className="w-72 p-0">
             <div className="flex h-full flex-col">
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation links for the main sections of the application.
                </SheetDescription>
              </SheetHeader>
              <div className="h-20 flex items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setIsSheetOpen(false)}>
                  <MockHickIcon className="w-8 h-8 text-primary" />
                  <span className="text-xl">MockHick</span>
                </Link>
              </div>
              <div className="flex-1 py-6 px-4">
                <NavLinks inSheet />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <MockHickIcon className="w-8 h-8 text-primary" />
            <span className="text-xl">MockHick</span>
          </Link>
        </div>
        <div className="flex-1 py-6 px-4">
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
