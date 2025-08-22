"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PAYMENT_LINK_DATA } from "@/types/types";
import { useCreatePaymentSession } from "@/hooks/useCreateSession";


type Props = {
  data : PAYMENT_LINK_DATA
}
const networks = [
  { id: "stacks", name: "Stacks", icon: "S" },
  { id: "bitcoin", name: "Bitcoin", icon: "₿" }
];

const currencies = [
  { id: "usdc", name: "USDC", symbol: "$" },
  { id: "btc", name: "sBTC", symbol: "₿" },
  { id: "usd", name: "USD", symbol: "$" }
];

const quickAmounts = [10, 25, 50, 100];

export default function PayLinkPage(data : Props) {
const router = useRouter()
  const { mutate: createSession, isPending } = useCreatePaymentSession();
  const [sessionCreated, setSessionCreated] = useState(false);


    useEffect(() => {
    if (data.data.paymentLink.type === "fixed") {
      createSession(
        { paymentLinkId: data.data.paymentLink.id },
        {
          onSuccess: (res) => {
            router.push(`/payment/checkout-session/${res.paymentSession.id}`);
          },
          onError: (err) => {
            console.error("Error creating session:", err);
          },
        }
      );
    }
  }, [data, createSession, router]);



  const [formData, setFormData] = useState({
    amount: "",
    currency: "btc",
    network: "stacks"
  });

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleContinueToPay = (amount : number, currency : string) => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }
    
  createSession(
      { paymentLinkId: data.data.paymentLink.id, amount, currency },
      {
        onSuccess: (res) => {
          router.push(`/checkout/${res.paymentSession.id}`);
           // Redirect to checkout
    router.push(`/payment/checkout-session/${res.paymentSession.id}`);
        },
      }
    );
    
  };

  const selectedNetwork = networks.find(n => n.id === formData.network);
  const selectedCurrency = currencies.find(c => c.id === formData.currency);

  const isValidAmount = formData.amount && parseFloat(formData.amount) > 0;

  //  create session and redirect
  


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">InkPay</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {data.data.paymentLink.title}
            </h1>
            <p className="text-sm text-gray-500">
              {data?.data.paymentLink.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Network and Currency Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Network</Label>
                <Select 
                  value={formData.network} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, network: value }))}
                >
                  <SelectTrigger className="w-full" data-testid="select-network">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {selectedNetwork?.icon}
                        </div>
                        <span>{selectedNetwork?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.id} value={network.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {network.icon}
                          </div>
                          <span>{network.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Coin</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="w-full" data-testid="select-currency">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {selectedCurrency?.symbol}
                        </div>
                        <span>{selectedCurrency?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {currency.symbol}
                          </div>
                          <span>{currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Amount to pay</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{selectedCurrency?.symbol}</span>
                </div>
                <Input
                  type="text"
                  placeholder="10"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-10 text-lg font-medium h-12 text-center"
                  data-testid="input-amount"
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="h-8 text-xs font-medium"
                  data-testid={`button-quick-amount-${amount}`}
                >
                  {amount}
                </Button>
              ))}
            </div>

            {/* Continue Button */}
            <Button
              onClick={()  => handleContinueToPay(Number(formData.amount), formData.currency)}
              disabled={!isValidAmount}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
              data-testid="button-continue-to-pay"
            >
               {isPending ? "Loading..." : `Continue to ${data.data.paymentLink.btnText}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}