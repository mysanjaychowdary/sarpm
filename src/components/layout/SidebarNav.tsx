"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Settings } from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-4 border-r bg-sidebar h-full shadow-lg rounded-r-lg",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-all hover:bg-sidebar-accent hover:text-sidebar-primary", // Increased px, py, and text-base
            location.pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-sidebar-foreground"
          )}
        >
          <item.icon className="h-5 w-5" /> {/* Slightly larger icons */}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}