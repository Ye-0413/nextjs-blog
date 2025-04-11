"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { config } from "@/lib/config"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Dock, { DockItem } from "@/components/Dock"
import { LayoutGroup } from "framer-motion"
import { Home, Book, FileText, SquareTerminal, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { menuItems } from "./nav-data"

interface NavItemWithHref extends DockItem {
  href: string
}

export function NavDesktopMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Use effect to handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only use theme after mounting to prevent hydration mismatch
  const isDarkMode = mounted && (resolvedTheme === 'dark')

  // Use navigation items from config
  const navItems = [
    { title: "Home", href: "/" },
    ...menuItems.map(item => ({ title: item.title, href: item.href || '#' })),
    { title: "Talks", href: "/talks" }
  ]

  // Map the navigation items to dock items with appropriate icons
  const dockItems: DockItem[] = navItems.map((item) => {
    // Determine if this item is active
    const isActive = pathname === item.href || 
      (item.href !== "/" && pathname.startsWith(item.href))

    // Set the appropriate icon based on the item
    let icon
    
    switch (item.title.toLowerCase()) {
      case "home":
        icon = <Home className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
        break
      case "articles":
      case "blog":
        icon = <FileText className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
        break
      case "news":
        icon = <Bell className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
        break
      case "publications":
        icon = <Book className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
        break
      case "talks":
        icon = <SquareTerminal className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
        break
      default:
        icon = <SquareTerminal className={cn("size-5", isActive ? "text-primary" : mounted ? (isDarkMode ? "text-gray-300" : "text-gray-500") : "opacity-0 transition-opacity")} />
    }

    return {
      icon,
      label: item.title,
      onClick: () => router.push(item.href),
      className: isActive ? "active" : "",
    }
  })

  return (
    <div className="hidden md:block">
      <LayoutGroup>
        <div className="flex items-center space-x-1 relative">
          {mounted && (
            <Dock 
              items={dockItems}
              magnification={60}
              baseItemSize={40}
              panelHeight={50}
              distance={80}
            />
          )}
        </div>
      </LayoutGroup>
    </div>
  )
}
