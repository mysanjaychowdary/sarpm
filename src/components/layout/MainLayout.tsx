"use client";

import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users, Key, Briefcase } from "lucide-react";

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
    title: "Employee Management",
    href: "/settings/employees",
    icon: Briefcase,
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav
        items={sidebarNavItems}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={toggleSidebar}
        className={isSidebarMinimized ? "w-16" : "w-64"} // Adjust width based on state
      />
      <div className={`flex-1 p-6 overflow-auto transition-all duration-300 ${isSidebarMinimized ? "ml-0" : "ml-0"}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;