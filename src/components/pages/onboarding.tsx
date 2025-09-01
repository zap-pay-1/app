"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Building2, Mail } from "lucide-react";
import AccountSettings from "./account-settings";
import { USER_DATA } from "@/types/types";
import BusinessSettings from "./business-settings";
import { useRouter } from "next/navigation";
interface OnboardingProps {
  onComplete?: () => void;
   data : USER_DATA
}


type OnboardingStep = 1 | 2;

export default function Onboarding({ onComplete, data }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const router = useRouter()
  const steps = [
    {
      number: 1,
      title: "Account Details",
      description: "Set up your personal information",
      icon: User
    },
    {
      number: 2,
      title: "Business Information", 
      description: "Configure your business details",
      icon: Building2
    }
  ];

  const currentStepData = steps.find(step => step.number === currentStep);
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...Array.from(prev), currentStep]));
    
    if (currentStep < steps.length) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
   // onComplete?.();
    router.replace("/dashboard")
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
       <AccountSettings data={data} showBackBtn={false} />
        );

      case 2:
        return (
          <BusinessSettings showBackBtn={false} />
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header with Progress */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to munaPay
            </h1>
            <p className="text-gray-600">
              Let&apos;s get you set up to start accepting Bitcoin payments
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                    ${currentStep >= step.number 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {completedSteps.has(step.number) ? '✓' : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-1 mx-2 transition-all duration-300
                      ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="w-64 mx-auto h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep} of {steps.length}
            </p>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Step Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {currentStepData && (
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <currentStepData.icon className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentStepData?.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {currentStepData?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={currentStep}
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                  className="p-6"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-800"
                  data-testid="button-skip"
                >
                  Skip for now
                </Button>

                <div className="flex space-x-3">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 px-6"
                      data-testid="button-continue"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      className="bg-green-600 hover:bg-green-700 px-6"
                      data-testid="button-complete"
                    >
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional decorative elements */}
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 opacity-20 blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
}