"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, Settings } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Master Setup",
    href: "/master-setup",
    icon: Settings,
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav items={sidebarNavItems} className="w-64" />
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;