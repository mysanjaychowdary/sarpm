"use client";

import React, { useState, useMemo } from "react";
import { SidebarNav } from "./SidebarNav";
import { Home, ListChecks, LayoutDashboard, Users, UserRound } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle"; // Import ThemeToggle

const MainLayout: React.FC = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const { user, signOut } = useSession();
  const { teamMembers } = useAppContext();

  const currentUserTeamMember = useMemo(() => {
    return teamMembers.find(member => member.id === user?.id);
  }, [teamMembers, user]);
  const isAdmin = currentUserTeamMember?.role === "Admin";

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const getSidebarNavItems = () => {
    const items = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        adminOnly: false,
      },
      {
        title: "Campaigns",
        href: "/campaigns",
        icon: ListChecks,
        adminOnly: false,
      },
      {
        title: "Panel Management",
        href: "/settings/panels",
        icon: LayoutDashboard,
        adminOnly: true,
      },
      {
        title: "Panel User Management",
        href: "/settings/panel-users",
        icon: Users,
        adminOnly: true,
      },
      {
        title: "Team Member Management",
        href: "/settings/team-members",
        icon: UserRound,
        adminOnly: true,
      },
    ];
    return items.filter(item => !item.adminOnly || isAdmin);
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
          <h1 className="text-2xl font-semibold">Welcome, {user?.email || "Guest"}!</h1>
          <div className="flex items-center space-x-4"> {/* Added a div to group user menu and theme toggle */}
            <ThemeToggle /> {/* Add ThemeToggle here */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata.avatar_url || ""} alt={user.email || "User"} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata.name || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;