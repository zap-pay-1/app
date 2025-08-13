"use client"

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Shield } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useSignUp } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/hooks/useRegisterUser";
type LoginStep = "email" | "otp" | "success";

export default function SignUp() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const {isLoaded, signUp, setActive} = useSignUp()
  const { toast } = useToast();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
 const router = useRouter()
 const registerUserMutation = useRegisterUser();
  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

      if (!isLoaded) {
        console.log(`SDK not loaded yet`)
        return
      }
    setIsLoading(true);

    // Request OPT
    
    // Start sign-up process using email and password provided
  try {
    await signUp.create({
      emailAddress  : email
    })

    // Send user an email with verification code
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

    // Set 'pendingVerification' to true to display second form
    // and capture OTP code
setStep("otp")
  toast({
        title: "OTP sent",
        description: `Verification code sent to ${email}`,
      });
       setCountdown(60);
  } catch (err ) {
    // See https://clerk.com/docs/custom-flows/error-handling
    // for more info on error handling
    console.error(JSON.stringify(err, null, 2))
      console.error("Send OTP error:", err);
      toast({
        title: "Failed to send OTP",
        description: "Please try again.",
        variant: "destructive",
      });
  
  }
   finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
   console.log("OTP  submitted")
      e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);

    if (!isLoaded) return

  try {
    // Use the code the user provided to attempt verification
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code : otp,
    })

    // If verification was completed, set the session to active
    // and redirect the user
    if (signUpAttempt.status === 'complete') {
      // CREATE USER IN DB
       await registerUserMutation.mutateAsync({
    clerkId: signUpAttempt.id!,
    email,
  });
     
      await setActive({ session: signUpAttempt.createdSessionId })
      setStep("success")
      router.replace('/')
    } else {
      // If the status is not complete, check why. User may need to
      // complete further steps.
      console.error(JSON.stringify(signUpAttempt, null, 2))
      setIsLoading(false)
    }
  } catch (err ) {
    // See https://clerk.com/docs/custom-flows/error-handling
    // for more info on error handling
    console.error(JSON.stringify(err, null, 2))
  }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      // Simulate resending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP resent",
        description: `New verification code sent to ${email}`,
      });
      
      setCountdown(60);
      setOtp("");
      
      // Clear and focus first input
      otpInputs.current.forEach(input => {
        if (input) input.value = "";
      });
      otpInputs.current[0]?.focus();
      
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));
    
    // Auto focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setCountdown(0);
  };

  const handleTestAuth = async () => {
          await registerUserMutation.mutateAsync({
    clerkId: "hahahhahahahah",
    email : "freewaka19@gmail.com",
  });
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
console.log("started google ath ")
  };

  const renderEmailStep = () => (
    <>
      {/* Header */}

      <button className="bg-yellow-300 py-4 px-7 rounded-xl" onClick={() => handleTestAuth()}>{registerUserMutation.isPending ? "Loading...." : "Test account creation"}</button>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Global payouts for web3 businesses
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Send funds to your vendors, contractors and employees in real time to 90+ countries
        </p>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
            required
            data-testid="input-email"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
          data-testid="button-login-email"
        >
          {isLoading ? "Sending..." : "Login or Signup with email"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium"
        data-testid="button-login-google"
      >
        <SiGoogle className="w-4 h-4 mr-3 text-red-500" />
        Login or Signup with Google
      </Button>
    </>
  );

  const renderOtpStep = () => (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToEmail}
          className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          data-testid="button-back-to-email"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to email
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Enter verification code
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        {/* OTP Inputs */}
        <div className="flex justify-center space-x-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Input
              key={index}
              ref={el => otpInputs.current[index] = el}
              type="text"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-primary focus:ring-primary"
              data-testid={`input-otp-${index}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
          data-testid="button-verify-otp"
        >
          {isLoading ? "Verifying..." : "Verify and Continue"}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">
          Didn&apos;t receive the code?
        </p>
        <Button
          variant="ghost"
          onClick={handleResendOtp}
          disabled={countdown > 0 || isLoading}
          className="text-primary hover:text-primary/90 font-medium p-0 h-auto"
          data-testid="button-resend-otp"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
        </Button>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-3">
        Welcome to sBTC Pay!
      </h1>
      <p className="text-sm text-gray-600">
        Taking you to your dashboard...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Copperx</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            {step === "email" && renderEmailStep()}
            {step === "otp" && renderOtpStep()}
            {step === "success" && renderSuccessStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        {step === "email" && (
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
              <span>© Copperx 2025</span>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Contact</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">Terms of Conditions</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}