"use client"


import { SESSION_DATA } from '@/types/types'
import { Clock, CreditCard, Mail, Phone, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'

type Props = {
  data : SESSION_DATA
}

// Mock payment link configurations
const paymentConfigs = {
  "contact-info": {
    id: "pl1",
    title: "This payment link title",
    description: "This is the description of payment link",
    amount: "10.0",
    currency: "USDC",
    collectName: true,
    collectEmail: true,
    collectPhone: true,
    collectBilling: true,
    collectShipping: false,
  },
  "billing-info": {
    id: "pl2", 
    title: "This payment link title",
    description: "This is the description of payment link",
    amount: "10.0",
    currency: "USDC",
    collectName: true,
    collectEmail: true,
    collectPhone: false,
    collectBilling: true,
    collectShipping: true,
  }
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

const billingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  country: z.string().min(1, "Country is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});
















export default function CheckoutPage(data : Props) {
    const [timeRemaining, setTimeRemaining] = useState(59 * 60 + 13);
      const [showQR, setShowQR] = useState(false);
       const [isProcessing, setIsProcessing] = useState(false);
  const [billingAsShipping, setBillingAsShipping] = useState(false);
   const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const paymentLinkId = "pl1";
    // Load checkout data from session storage or use mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if we have checkout data from payment page
      const checkoutData = sessionStorage.getItem('checkoutData');
      if (checkoutData) {
        const data = JSON.parse(checkoutData);
        setPaymentConfig({
          id: data.sessionId,
          title: "Payment Checkout",
          description: "Complete your payment using sBTC",
          amount: data.amount,
          currency: data.currency,
          network: data.network,
          collectName: true,
          collectEmail: true,
          collectPhone: false,
          collectBilling: false,
          collectShipping: false,
        });
      } else {
        // Fallback to mock config for payment link scenario
        const configType = paymentLinkId && paymentConfigs[paymentLinkId] ? paymentLinkId : "contact-info";
        setPaymentConfig(paymentConfigs[configType]);
      }
      //setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [paymentLinkId]);


  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
 const schema = paymentConfig?.collectBilling ? billingSchema : contactSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: paymentConfig?.collectBilling ? {
      name: "",
      email: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    } : {
      name: "",
      email: "",
      phone: "",
    },
  });
 
  const handleSubmit = async (data: any) => {
    //setFormStep(2);
  };
  return (
    <div className='w-full h-screen flex flex-col md:flex-row '>
 <div className=' w-full md:w-1/2 flex-1 bg-gray-50 h-screen flex  py-4 md:py-10 justify-end border-b border-r-0 md:border-r md:border-gray-200 px-4 md:px-10 relative'>
    <div className=' border border-red-600 h-[600px] w-full md:max-w-[500px]'>
    <div className="bg-white rounded-lg border p-6 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Total payable amount</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-lg font-bold text-gray-900">{"10"} {"BTC"}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{`this is the title part`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{`This is the description part.....`}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">10.0 USDC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 flex border justify-between">
                    <div>
                    <h4 className="text-sm font-medium text-gray-900">{`this is the title part`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{`This is the description part.....`}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">10.0 USDC</span>
                    </div>
                  </div>
                </div>
              </div>

                    <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 flex border justify-between">
                    <div>
                    <h4 className="text-sm font-medium text-gray-900">{`this is the title part`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{`This is the description part.....`}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">10.0 USDC</span>
                    </div>
                  </div>
                </div>
              </div>
                    <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1 flex border justify-between">
                    <div>
                    <h4 className="text-sm font-medium text-gray-900">{`this is the title part`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{`This is the description part.....`}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">10.0 USDC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{`30`} {`BTC`}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <button className="text-blue-600 hover:text-blue-800 text-left">
                    Add discount code
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    Apply
                  </button>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Amount due</span>
                  <span>{`40`} {`BTC`}</span>
                </div>
              </div>
            </div>
    </div>

    <div className='p-5 border border-yellow-500 hidden md:flex items-center justify-center absolute bottom-2 w-full max-w-[500px]'>
        <p>Absolute contents</p>
    </div>
 </div>
 <div className='w-full md:w-1/2 flex-1 bg-white h-screen flex px-4  md:px-20 py-4 md:py-10'>
<div className=' border border-blue-400  w-full md:max-w-[500px]'>
        <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  <h1 className="text-xl font-semibold text-gray-900">linkPay</h1>
                </div>
                {timeRemaining > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Pay within {formatTime(timeRemaining)} min
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Fill in the details</h2>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                          <User className="w-4 h-4 mr-2" />
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Achal Sahaya"
                          {...form.register("name")}
                          className="mt-1"
                          data-testid="input-name"
                        />
                        {form.formState.errors.name && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="sahayaachal2@gmail.com"
                          {...form.register("email")}
                          className="mt-1"
                          data-testid="input-email"
                        />
                        {form.formState.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      {paymentConfig?.collectPhone && (
                        <div>
                          <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            placeholder="9632206542"
                            {...form.register("phone")}
                            className="mt-1"
                            data-testid="input-phone"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information (only if collecting billing) */}
                  {paymentConfig?.collectShipping && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Shipping Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select onValueChange={(value) => form.setValue("country", value)}>
                            <SelectTrigger data-testid="select-country">
                              <SelectValue placeholder="Tanzania" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TZ">Tanzania</SelectItem>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="addressLine1">Address line 1</Label>
                          <Input
                            id="addressLine1"
                            placeholder="kyamuhanga"
                            {...form.register("addressLine1")}
                            className="mt-1"
                            data-testid="input-address-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="addressLine2">Address line 2</Label>
                          <Input
                            id="addressLine2"
                            placeholder="kagombo"
                            {...form.register("addressLine2")}
                            className="mt-1"
                            data-testid="input-address-2"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="bukoba"
                              {...form.register("city")}
                              className="mt-1"
                              data-testid="input-city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              placeholder="Kagera"
                              {...form.register("state")}
                              className="mt-1"
                              data-testid="input-state"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP/Postal code</Label>
                            <Input
                              id="zipCode"
                              placeholder="33106"
                              {...form.register("zipCode")}
                              className="mt-1"
                              data-testid="input-zip"
                            />
                          </div>
                        </div>

                        {paymentConfig.collectBilling && (
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="billingAsShipping"
                              checked={billingAsShipping}
                              onCheckedChange={(checked) => setBillingAsShipping(checked === true)}
                              data-testid="checkbox-billing-same"
                            />
                            <Label htmlFor="billingAsShipping" className="text-sm">
                              Billing Details same as shipping details
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-continue"
                  >
                    Continue with your preferred payment method
                  </Button>
                </form>
              </div>
            </div>
    </div>
 </div>
    </div>
  )
}
