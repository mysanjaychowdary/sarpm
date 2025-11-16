"use client";

import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users, Briefcase, LogOut } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Outlet } from "react-router-dom"; // Import Outlet
import { showError, showSuccess } from "@/utils/toast";

const MainLayout: React.FC = () => { // Removed children prop from type
  const { user, isLoadingSession, isAdmin, isCampaignManager } = useSession();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showSuccess("Logged out successfully!");
      navigate("/login");
    } catch (error: any) {
      showError("Failed to log out: " + error.message);
    }
  };

  const getSidebarNavItems = () => {
    const items = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: ["Admin", "Campaign Manager"],
      },
      {
        title: "Campaigns",
        href: "/campaigns",
        icon: ListChecks,
        roles: ["Admin", "Campaign Manager"],
      },
    ];

    if (isAdmin) {
      items.push(
        {
          title: "Panel Management",
          href: "/settings/panels",
          icon: LayoutDashboard,
          roles: ["Admin"],
        },
        {
          title: "Panel User Management",
          href: "/settings/panel-users",
          icon: Users,
          roles: ["Admin"],
        },
        {
          title: "Employee Management",
          href: "/settings/employees",
          icon: Briefcase,
          roles: ["Admin"],
        }
      );
    }
    return items;
  };

  const sidebarNavItems = getSidebarNavItems();

  if (isLoadingSession) {
    return null;
  }

  if (!user) {
    return null;
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
          <h1 className="text-2xl font-semibold">Welcome, {user?.email}!</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>
        <Outlet /> {/* Render nested routes here */}
      </div>
    </div>
  );
};

export default MainLayout;