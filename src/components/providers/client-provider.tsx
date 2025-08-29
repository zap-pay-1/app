
"use client"

import { queryClient } from '@/lib/queryClient';
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from '../ui/toaster';
import { SidebarProvider } from '../ui/sidebar';
export default function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
     <QueryClientProvider client={queryClient}>
          <SidebarProvider>
        {children}
            </SidebarProvider>
           <Toaster />
        </QueryClientProvider>
   
  );
}
