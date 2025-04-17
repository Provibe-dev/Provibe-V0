"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  User,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Define props interface for the component
interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Define the DashboardSidebar component
export function DashboardSidebar({ className }: SidebarProps) {
  // --- Hooks ---
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- Event Handlers ---
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Save preference to localStorage
    localStorage.setItem("sidebarCollapsed", String(!isCollapsed));
  };

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  // --- Navigation Data ---
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Create",
      href: "/dashboard/create",
      icon: FileText,
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  // --- Sidebar Content JSX ---
  const sidebarContent = (
    <>
      {/* Header Section (Logo, Brand, Collapse Button) */}
      <div className="flex items-center border-b px-1.5 py-2.5 mb-2.5">
        <Link href="/dashboard" className="flex items-center gap-2 p-1.5 rounded-full shrink-0" onClick={closeMobileMenu}>
          <img alt="ProVibe Logo" src="/logo.png" width="30" height="30" className="rounded-full" />
          {!isCollapsed && <span className="text-2xl font-bold tracking-tight">ProVibe</span>}
        </Link>
        {/* Collapse Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto size-12 bg-inherit hover:bg-muted rounded-lg" 
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapse}
        >
          {isCollapsed ? 
            <PanelLeft className="size-5 text-muted-foreground" /> : 
            <PanelLeftClose className="size-5 text-muted-foreground" />
          }
        </Button>
      </div>

      {/* Navigation List Section */}
      <ul className="flex flex-col items-center gap-0.5 w-full px-2.5 flex-grow">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href || (pathname?.startsWith(href) && href !== '/dashboard');
          return (
            <li key={href} className={cn(
              "w-full p-0 font-medium rounded-[32px] transition-colors",
              active ? "bg-primary/10" : "hover:bg-muted"
            )}>
              <Link
                href={href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center h-10 gap-2 p-2 rounded-[inherit]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <div className="flex items-center justify-center w-5 h-5 shrink-0">
                  <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                </div>
                {!isCollapsed && <span className="truncate">{name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Plan Card Section */}
      {!isCollapsed && (
        <div className="w-full p-2.5 mt-2.5">
          <div className="flex flex-col gap-4 p-4 border rounded-[32px] transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center text-sm font-medium">
              <p className="font-semibold">Current Plan</p>
              <span className="uppercase text-xs font-bold text-primary">free</span>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 rounded-full border-primary hover:border-primary/20 bg-primary/5 text-primary hover:text-primary group"
              aria-label="Upgrade plan"
              onClick={() => { closeMobileMenu(); }}
            >
              Upgrade Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="size-4 ml-auto transition-transform group-hover:translate-x-1"
                fill="currentColor"
              >
                <path d="m10.04 3.522 3.771 3.771a1 1 0 0 1 0 1.414l-3.77 3.772a1 1 0 0 1-1.415-1.415L10.69 9H3a1 1 0 0 1 0-2h7.69L8.627 4.936a1 1 0 0 1 1.414-1.414z" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Account Section with dropdown menu */}
      <div className="p-2.5 mt-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex items-center hover:bg-muted p-2.5 transition-colors rounded-full group cursor-pointer"
              aria-label="Account menu"
            >
              <Avatar className="h-7 w-7 mr-2 shrink-0">
                <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User Avatar'} />
                <AvatarFallback className="bg-foreground text-background text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <span className="font-medium truncate flex-1">{user?.name ?? "User Name"}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 transition-transform group-hover:rotate-180 shrink-0" />
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center" onClick={closeMobileMenu}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile#account" className="flex items-center" onClick={closeMobileMenu}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile#security" className="flex items-center" onClick={closeMobileMenu}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Security</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button 
                className="flex items-center w-full text-destructive" 
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  // --- Component Return JSX ---
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden rounded-full"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Sidebar Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 transform flex-col border-r bg-background shadow-lg transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
      >
        {sidebarContent}
      </div>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden h-[calc(100vh-2.5rem)] flex-col border bg-background md:flex",
        "rounded-[32px] sticky top-5 left-5 p-2.5 transition-all duration-300",
        isCollapsed ? "w-[5.5rem]" : "w-72",
        className
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
