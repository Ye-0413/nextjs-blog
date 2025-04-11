"use client"

import { Menu } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Dock, { DockItem } from "@/components/Dock";
import { useEffect, useState } from "react";
import { Home, Book, FileText, SquareTerminal, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { menuItems } from "./nav-data";

export function NavMobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Use effect to handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only use theme after mounting to prevent hydration mismatch
  const isDarkMode = mounted && (resolvedTheme === 'dark');

  // Use navigation items from config
  const navItems = [
    { title: "Home", href: "/" },
    ...menuItems.map(item => ({ title: item.title, href: item.href || '#' }))
  ];

  // Close sheet when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Map the navigation items to dock items with appropriate icons
  const dockItems: DockItem[] = navItems.map((item) => {
    // Determine if this item is active
    const isActive = pathname === item.href || 
      (item.href !== "/" && pathname.startsWith(item.href));

    // Set the appropriate icon based on the item
    let icon;
    
    switch (item.title.toLowerCase()) {
      case "home":
        icon = <Home className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />;
        break;
      case "articles":
      case "blog":
        icon = <FileText className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />;
        break;
      case "news":
        icon = <Bell className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />;
        break;
      case "publications":
        icon = <Book className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />;
        break;
      default:
        icon = <SquareTerminal className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />;
    }

    return {
      icon,
      label: item.title,
      onClick: () => {
        router.push(item.href);
        setIsOpen(false);
      },
      className: isActive ? "active" : ""
    };
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className={cn("p-2 md:hidden", mounted ? (isDarkMode ? "text-gray-100" : "text-gray-900") : "text-transparent")}
          aria-label="Open menu"
          suppressHydrationWarning
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className={cn("flex flex-col p-4", mounted ? (isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900") : "bg-gray-100 text-gray-500")}>
        <div className="flex flex-col space-y-1 mt-8">
          <div className="flex justify-center mb-8">
            {mounted && (
              <Dock 
                items={dockItems}
                magnification={60}
                baseItemSize={45}
                panelHeight={220}
                dockHeight={300}
                distance={100}
                className="dock-mobile"
                vertical={true}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}