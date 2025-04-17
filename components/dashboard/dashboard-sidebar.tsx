"use client";

// Import necessary hooks, components, and libraries
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"; // Needed for Search, assuming it's available
import {
  LayoutDashboard, // Original icon
  FileText, // Original icon
  FolderKanban, // Original icon
  Settings, // Original icon
  LogOut, // Needed for account dropdown action?
  Menu, // Hamburger icon for mobile trigger
  X, // Close icon for mobile trigger
  Home, // Icon from example (can be used for Dashboard)
  Star, // Icon from example
  Package2, // Icon from example
  Folder, // Icon from example
  ChevronDown, // Icon from example
  Plus, // Icon from example
  Search, // Icon for Search bar
  PanelLeftClose, // Icon for Collapse button
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Shield } from "lucide-react"; // Additional icons for menu items

// Define props interface for the component
interface SidebarProps {
  className?: string; // Optional className prop for custom styling
  // Add a prop for sidebar state if making it collapsible
  // isCollapsed?: boolean;
  // onToggleCollapse?: () => void;
}

// Define the DashboardSidebar component
export function DashboardSidebar({ className }: SidebarProps) {
  // --- Hooks ---
  const { user, logout } = useAuth(); // Get user data and logout function
  const pathname = usePathname(); // Get the current route's pathname
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

  // --- Event Handlers ---
  // Toggle mobile menu open/closed
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu (used when clicking a link or button)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // --- Navigation Data (Restored Original Links) ---
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard, // Using original icon
    },
    {
      name: "Create",
      href: "/dashboard/create",
      icon: FileText, // Using original icon
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: FileText, // Using original icon
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban, // Using original icon
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings, // Using original icon
    },
    
     // Add Favourites/Integrations if needed, e.g.:
    // { name: "Favourites", href: "/dashboard/favourites", icon: Star },
    // { name: "Integrations", href: "/dashboard/integrations", icon: Package2 },
  ];

  // --- Sidebar Content JSX (Updated Structure & Style based on new example) ---
  // Reusable JSX for the sidebar content
  const sidebarContent = (
    <>
      {/* Header Section (Logo, Brand, Collapse Button) */}
      <div className="flex items-center border-b px-1.5 py-2.5 mb-2.5">
        <Link href="/dashboard" className="flex items-center gap-2 p-1.5 rounded-full shrink-0" onClick={closeMobileMenu}>
          {/* Logo and name with improved alignment */}
          <img alt="ProVibe Logo" src="/logo.png" width="36" height="36" className="rounded-full" />
          <span className="text-lg font-semibold tracking-tight">ProVibe</span>
        </Link>
        {/* Collapse Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto size-8 bg-inherit hover:bg-muted rounded-lg" 
          aria-label="Toggle sidebar"
          onClick={() => {
            console.log("Toggle sidebar collapse");
          }}
        >
          <PanelLeftClose className="size-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Navigation List Section - Fixed alignment */}
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
                  "flex items-center h-10 gap-2 p-2 rounded-[inherit]", // Fixed height and alignment
                  active ? "text-primary" : "text-muted-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {/* Icon Container - Improved alignment */}
                <div className="flex items-center justify-center w-5 h-5 shrink-0">
                  <Icon className={cn("size-5", active ? "text-primary" : "text-muted-foreground")} />
                </div>
                {/* Text - Improved alignment */}
                <span className="truncate">{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>


      {/* Plan Card Section (Pushed towards Bottom) */}
      <div className="w-full p-2.5 mt-2.5"> {/* Use margin instead of mt-auto here */}
        <div className="flex flex-col gap-4 p-4 border rounded-[32px] transition-shadow hover:shadow-md">
           {/* Use custom border/shadow: border-border hover:shadow-notesHover */}
          {/* Plan Info */}
          <div className="flex justify-between items-center text-sm font-medium">
            <p className="font-semibold">Current Plan</p>
            <span className="uppercase text-xs font-bold text-primary">free</span>
          </div>
          {/* Upgrade Button */}
          {/* NOTE: This button still needs an onClick handler or be a Link */}
          <Button
            variant="outline"
            className="w-full gap-2 rounded-full border-primary hover:border-primary/20 bg-primary/5 text-primary hover:text-primary group"
             // Use custom styles if needed: border-error-foreground? bg-primary-background? hover:bg-primary-background?
            aria-label="Upgrade plan"
             onClick={() => { /* Implement upgrade action */ closeMobileMenu(); }}
          >
            {/* Consider adding Upgrade Icon from example if desired */}
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
               <span className="font-medium truncate flex-1">{user?.name ?? "User Name"}</span>
               <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 transition-transform group-hover:rotate-180 shrink-0" />
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
      {/* Mobile Menu Button (Remains the same) */}
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

      {/* Mobile Sidebar Panel (Inherits sidebarContent changes) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 transform flex-col border-r bg-background shadow-lg transition-transform duration-300 ease-in-out md:hidden", // Base styles
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full", // Slide logic
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Render the updated sidebar content */}
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

      {/* Desktop Sidebar (Fixed Position - Updated Style) */}
      {/* Applying structure and styles from the latest example */}
      <aside className={cn(
        "hidden h-[calc(100vh-2.5rem)] w-72 flex-col border bg-background md:flex", // Base styles for desktop - Adjusted h, w
        "rounded-[32px] sticky top-5 left-5 p-2.5", // Styles from example: rounded, sticky, padding
         // Use custom border color if needed: border-border
        className
      )}>
        {/* Render the updated sidebar content */}
        {sidebarContent}
      </aside>
    </>
  );
}
