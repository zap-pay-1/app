"use client"

import { Button } from "@/components/ui/button";
import { Download, Github, MoveRightIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { SiGitbook } from "react-icons/si";
export default function Navigation() {
const {user} = useUser()
  // https://discord.gg/pGzpYGuM
const openInNewTab = (url: string) => {
  if (!url.startsWith("http")) {
    console.warn("URL should be absolute. Example: https://example.com");
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

 const router = useRouter()
  const handleRedirect = () => {
   // window.location.assign("https://app.mygoat.fun/download");
   if(user){
     router.replace("/dashboard")
   }else {
    router.replace("/auth/signup")
   }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-0">
            <Image width={60} height={60} src={`/img/logo.svg`} alt="munaPay" className="w-[170px]  object-cover " />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-5">
            
           <SiGitbook className=" text-gray-700 cursor-pointer w-6 h-6" onClick={() => openInNewTab("https://zenvid.gitbook.io/muna-pay")} />
           <Github className=" text-gray-700 cursor-pointer" onClick={() => openInNewTab("https://github.com/orgs/zap-pay-1/repositories")} />

           </div>
            <a href="#" className="text-gray-700 hidden hover:text-white transition-colors">
              Careers
            </a>
            <Button className="bg-gradient-to-r from-lime-primary to-lime-secondary text-dark-bg px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => handleRedirect()}>
              Get Started
              <MoveRightIcon />
            </Button>
         
          </div>
        </div>
      </div>
    </nav>
  );
}
