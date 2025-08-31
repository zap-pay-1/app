"use client"

import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface StickyInfoBannerProps {
  title?: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onDismiss?: () => void;
  className?: string;
  variant?: "info" | "warning" | "success";
}

export function StickyInfoBanner({
  message,
  buttonText = "Complete Setup",
  onButtonClick,
  onDismiss,
  className = "",
  variant = "warning"
}: StickyInfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleButtonClick = () => {
    onButtonClick?.();
  };

  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    success: "bg-green-50 border-green-200 text-green-900"
  };

  const iconStyles = {
    info: "text-blue-600",
    warning: "text-yellow-600", 
    success: "text-green-600"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            sticky top-0 z-50 w-full border-b
            ${variantStyles[variant]}
            ${className} mb-4
          `}
          data-testid="sticky-info-banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-4">
              {/* Left side - Icon and message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Info 
                  className={`w-5 h-5 flex-shrink-0 ${iconStyles[variant]}`}
                  data-testid="banner-icon"
                />
                <p className="text-sm font-medium flex-1 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Right side - Button and close */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {onButtonClick && (
                  <Button
                    onClick={handleButtonClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 h-auto font-medium"
                    data-testid="banner-button"
                  >
                    {buttonText}
                  </Button>
                )}
                
                <button
                  onClick={handleDismiss}
                  className={`
                    p-1 rounded-md hover:bg-black/5 transition-colors
                    ${iconStyles[variant]} hover:${iconStyles[variant]}/80
                  `}
                  data-testid="banner-close"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}