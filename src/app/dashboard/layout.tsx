"use client"

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { StickyInfoBanner } from "@/components/stick-info-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


            <div className="min-h-screen bg-gray-50  w-full max-w-full">
              {/* Small screen notice */}
      <div className="flex lg:hidden items-center justify-center w-full h-screen bg-gray-100 p-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Not Optimized for Mobile
          </h1>
          <p className="text-gray-700">
            This dashboard is best viewed on a desktop or large screen device.  
            Please switch to a bigger screen for the full experience.
          </p>
        </div>
      </div>
          
      {/* Actual layout (hidden on small screens) */}
      <div className="hidden md:flex flex-1 w-full">
  {/* Sidebar */}
  <aside className="text-white"><AppSidebar/></aside>
 
 
  {/* Main content */}
  <main className="flex-1 ">
     <Header />
    <div className="flex-1 p-4" >
      <div className="max-w-[1500px] mx-auto w-full">
      {children}
      </div>
      </div>
  </main>
</div>
        </div>

   
  );
}
