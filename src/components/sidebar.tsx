
"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, CreditCard, ExternalLink, Key, Webhook, BarChart3, LogOut, Zap, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Payment Links", href: "/dashboard/payment-links", icon: ExternalLink },
  { name: "API & Keys", href: "/dashboard/api-keys", icon: Key },
  { name: "Webhooks", href: "/dahsboard/webhooks", icon: Webhook },
  { name: "Settings", href: "/dahsboard/settings", icon: Settings },
];

export default function Sidebar() {
const pathname = usePathname()
  

  return (
    <div className="fixed left-0 top-[60px] h-screen w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0 hidden">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">sBTC Pay</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div 
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "text-primary bg-indigo-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Account */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{"User"}</p>
            <p className="text-xs text-gray-500">{"user@company.com"}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => console.log("logo out")}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
