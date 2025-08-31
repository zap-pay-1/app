"use client"

import { Calendar, CreditCard, Home, Inbox, Key, Link, LogOut, Search, Settings, Webhook } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser, useAuth } from "@clerk/clerk-react"
import { EmailAddress } from "@clerk/nextjs/server"
import { truncateMiddle } from "@/lib/utils"
import { usePathname } from "next/navigation"
import LogoComp from "./LogoComp"
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Payment Links",
    url: "/dashboard/payment-links",
    icon: Link,
  },
  {
    title: "API & Keys",
    url: "/dashboard/api-keys",
    icon: Key,
  },
   {
    title: "Webhooks",
    url: "/dashboard/webhooks",
    icon: Webhook,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
    const {user, }  = useUser()
    const {signOut} = useAuth()
    const pathName = usePathname()
 const userEmail = user?.primaryEmailAddress?.emailAddress
  return (
    <Sidebar variant="sidebar" >
        <SidebarHeader>
           <LogoComp />
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
       {items.map((item) => {
  const isDashboard = item.url === "/dashboard";
  const isActive = isDashboard
    ? pathName === "/dashboard"
    : pathName.startsWith(item.url);

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive} size={"lg"}>
        <a href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
             {/* User Account */}
      <div className="p-4 border-t border-gray-200  ">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{"User"}</p>
            <p className="text-xs text-gray-500">{userEmail && truncateMiddle(userEmail, 9, 9)}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => console.log("logo out")}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4"  onClick={() => signOut()}/>
          </button>
        </div>
      </div>
      </SidebarFooter>
    </Sidebar>
  )
}