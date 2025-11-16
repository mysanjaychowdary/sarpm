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
        "flex flex-col space-y-4 p-4 border-r bg-gray-50 dark:bg-gray-900 h-screen sticky top-0", // Changed background, added sticky top-0 and h-screen
        className
      )}
      {...props}
    >
      <div className="mb-6 px-3">
        <h2 className="text-2xl font-bold text-primary dark:text-primary">Dyad App</h2> {/* Simple header */}
      </div>
      <div className="flex flex-col space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",
              location.pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary dark:hover:bg-primary" // Active state
            )}
          >
            <item.icon className="h-5 w-5" /> {/* Slightly larger icons */}
            <span className="text-base font-medium">{item.title}</span> {/* Clearer text */}
          </Link>
        ))}
      </div>
    </nav>
  );
}