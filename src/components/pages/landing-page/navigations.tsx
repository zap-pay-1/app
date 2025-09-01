"use client"

import { Button } from "@/components/ui/button";
import { Download, Github, X } from "lucide-react";
import Image from "next/image";
export default function Navigation() {

  // https://discord.gg/pGzpYGuM
const openInNewTab = (url: string) => {
  if (!url.startsWith("http")) {
    console.warn("URL should be absolute. Example: https://example.com");
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

  const handleRedirect = () => {
    window.location.assign("https://app.mygoat.fun/download");
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-0">
            <Image width={60} height={60} src={`/img/logo.svg`} alt="munaPay" className="w-[170px]  object-cover " />
            <span className="text-xl font-bold text-gray-900 hidden">GOAT</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-5">
            
           <X className=" text-gray-700 cursor-pointer" onClick={() => openInNewTab("https://x.com/goat_w3")} />
           <Github className=" text-gray-700 cursor-pointer" onClick={() => openInNewTab("https://discord.gg/pGzpYGuM")} />

           </div>
            <a href="#" className="text-gray-700 hidden hover:text-white transition-colors">
              Careers
            </a>
            <Button className="bg-gradient-to-r from-lime-primary to-lime-secondary text-dark-bg px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => handleRedirect()}>
              <Download />
              Get App
            </Button>
         
          </div>
        </div>
      </div>
    </nav>
  );
}
