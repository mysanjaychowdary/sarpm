"use client";

import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users } from "lucide-react"; // Removed Briefcase and LogOut
import { Outlet } from "react-router-dom"; // Removed useNavigate, supabase, showError, showSuccess

const MainLayout: React.FC = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const getSidebarNavItems = () => {
    const items = [
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
    ];
    return items;
  };

  const sidebarNavItems = getSidebarNavItems();

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav
        items={sidebarNavItems}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={toggleSidebar}
        className={isSidebarMinimized ? "w-16" : "w-64"}
      />
      <div className={`flex-1 p-6 overflow-auto transition-all duration-300 ${isSidebarMinimized ? "ml-0" : "ml-0"}`}>
        <header className="flex justify-between items-center pb-4 border-b mb-6">
          <h1 className="text-2xl font-semibold">Welcome!</h1> {/* Generic welcome message */}
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;