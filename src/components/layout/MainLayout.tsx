"use client";

import React from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users, Key } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: ListChecks,
  },
  {
    title: "Panel Management",
    href: "/settings/panels",
    icon: LayoutDashboard,
  },
  {
    title: "Panel User Management",
    href: "/settings/panel-users",
    icon: Users,
  },
  {
    title: "Panel 3 Credentials",
    href: "/settings/panel3-credentials",
    icon: Key,
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