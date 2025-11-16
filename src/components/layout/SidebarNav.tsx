"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
    // roles property removed as there is no role-based access
  }[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export function SidebarNav({ className, items, isMinimized, onToggleMinimize, ...props }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "flex flex-col space-y-4 p-4 border-r bg-gray-50 dark:bg-gray-900 h-screen sticky top-0 transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="mb-6 px-3 flex items-center justify-between">
        {!isMinimized && (
          <h2 className="text-2xl font-bold text-primary dark:text-primary whitespace-nowrap">SA Report Manager</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className={cn("ml-auto", isMinimized && "mx-auto")}
        >
          {isMinimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex flex-col space-y-1">
        {items.map((item) => (
          isMinimized ? (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",
                    location.pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary dark:hover:bg-primary",
                    "justify-center px-2" // Center icon when minimized
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",
                location.pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary dark:hover:bg-primary"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-base font-medium whitespace-nowrap overflow-hidden">
                {item.title}
              </span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}