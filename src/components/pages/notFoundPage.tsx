
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                404
              </h1>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                This page doesn&apos;t exist.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Please check the URL or refresh browser.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
            >
              <Button
                onClick={handleGoHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 font-medium"
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Back Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400 to-red-400 opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
}