
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      
            <div className="min-h-screen bg-gray-50 ">
              <Header />
               <div className="ml-64 flex flex-col min-h-screen px-4">
              <Sidebar />
        {children}
         
        </div>
        </div>
   
  );
}
