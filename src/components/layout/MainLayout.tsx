"use client";

import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users, Briefcase, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext"; // New import
import { supabase } from "@/integrations/supabase/client"; // New import
import { showError, showSuccess } from "@/utils/toast"; // New import
import { Button } from "@/components/ui/button"; // Ensure Button is imported

const MainLayout: React.FC = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const { isAdmin, isEmployee, isLoadingSession } = useSession(); // Use session context
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      showSuccess("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout error:", error.message);
      showError("Failed to log out: " + error.message);
    }
  };

  const getSidebarNavItems = () => {
    const items = [];

    if (isAdmin || isEmployee) {
      items.push(
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: Home,
        },
        {
          title: "Campaigns",
          href: "/campaigns",
          icon: ListChecks,
        }
      );
    }

    if (isAdmin) {
      items.push(
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
        }
      );
    }
    return items;
  };

  const sidebarNavItems = getSidebarNavItems();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading user session...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold">Welcome!</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;