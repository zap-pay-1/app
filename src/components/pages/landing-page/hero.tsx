
"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVideoDialogDemoTopInBottomOut } from "./video-demo";
import { BorderBeam } from "@/components/ui/beam-border";


interface BettingExperienceProps {
  addParallaxRef: (el: HTMLElement | null) => void;
}

export default function Hero({ addParallaxRef }: BettingExperienceProps) {
    const handleRedirect = () => {
    window.location.assign("https://app.mygoat.fun/download");
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden  w-full bg-[#f8fafc]  text-gray-900 ">
         {/*  Background Pattern */}
        <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
      backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    }}
  />
         {/* Large Background Text */}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <motion.h1 
  ref={addParallaxRef}
  className="text-[20vw] md:text-[15vw] lg:text-[12vw] font-black text-white select-none whitespace-nowrap"
  animate={{ x: ["100%", "-100%"] }}
  transition={{
    repeat: Infinity,
    duration: 45,
    ease: "easeIn"
  }}
>
  Predict Greatness • Predict Greatness • Predict Greatness • Predict Greatness •
</motion.h1>
      </div>

      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 py-20">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
           Bet on Players. Not Just Teams.
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Predict player performance in PvP markets — goals, assists, knockouts, kills.
          </p>
          <p className="text-lg text-gray-600 mb-8">
          No house. No odds manipulation. Just you vs fans like you.
          </p>
          <Button className="bg-gradient-to-r from-lime-primary to-lime-secondary text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => handleRedirect()}>
            <Download />
            Install App
          </Button>
        </motion.div>

        {/* App Screenshots Grid */}
        <div className="w-full flex items-center justify-center  ">
          {/* Left Screenshot - Betting Card */}


          {/* Right Screenshot - Social Interaction */}
          <motion.div 
            className="relative flex flex-col space-y-5 border-2 border-primary rounded-lg"
            initial={{ opacity: 0, x: 50, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0,}}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: false }}
            whileHover={{ rotate: 0 }}
          >
            <HeroVideoDialogDemoTopInBottomOut />
          </motion.div>
         <BorderBeam duration={8} size={100} />
      </div>
      </div>
    </section>
  );
}


