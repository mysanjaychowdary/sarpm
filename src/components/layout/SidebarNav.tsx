"use client";

import { Link } from "react-router-dom";
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
  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-4 border-r bg-sidebar h-full", // h-full ensures it takes full height of its flex parent
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            // Add active state styling if needed, e.g., if current path matches item.href
            // location.pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}