"use client"

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Copy, ExternalLink, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Placeholder payment links data
const placeholderPaymentLinks = [
  {
    id: "pl1",
    url: "https://buy.cooperco/payment/a54b32f1-d8e9-4c2a-9f1e-8b4d5a2c7e9f",
    title: "my payments",
    tags: "",
    createdOn: "Sep 03 2024, 10:10 AM",
    amount: "10.0 USDC",
    status: "Active",
    collectName: "No",
    collectEmail: "No", 
    collectPhone: "No",
    collectBilling: "No",
    confirmationMessage: "Default",
    callToAction: "Pay",
    allowPromotionCodes: "No"
  },
  {
    id: "pl2",
    url: "https://buy.cooperco/payment/b65c43g2-e9f0-5d3b-0g2f-9c5e6b3d8f0g",
    title: "my test donation round",
    tags: "",
    createdOn: "Aug 17 2024, 12:47 PM",
    amount: "Any Amount",
    status: "Active",
    collectName: "Yes",
    collectEmail: "Yes",
    collectPhone: "No",
    collectBilling: "No", 
    confirmationMessage: "Thank you for your donation!",
    callToAction: "Donate",
    allowPromotionCodes: "Yes"
  },
  {
    id: "pl3",
    url: "https://buy.cooperco/payment/c76d54h3-f0g1-6e4c-1h3g-0d6f7c4e9g1h",
    title: "my testing link",
    tags: "",
    createdOn: "Aug 15 2024, 09:44 AM",
    amount: "10.0 USDC",
    status: "Active",
    collectName: "No",
    collectEmail: "No",
    collectPhone: "No",
    collectBilling: "No",
    confirmationMessage: "Default",
    callToAction: "Pay",
    allowPromotionCodes: "No"
  },
  {
    id: "pl4",
    url: "https://buy.cooperco/payment/d87e65i4-g1h2-7f5d-2i4h-1e7g8d5f0h2i",
    title: "my payments",
    tags: "",
    createdOn: "Aug 13 2024, 01:54 PM",
    amount: "100.0 USDC",
    status: "Active",
    collectName: "Yes",
    collectEmail: "Yes", 
    collectPhone: "Yes",
    collectBilling: "Yes",
    confirmationMessage: "Your order has been confirmed!",
    callToAction: "Purchase",
    allowPromotionCodes: "Yes"
  },
  {
    id: "pl5",
    url: "https://buy.cooperco/payment/e98f76j5-h2i3-8g6e-3j5i-2f8h9e6g1i3j",
    title: "please help to donate",
    tags: "",
    createdOn: "Mar 06 2024, 03:33 PM",
    amount: "Any Amount",
    status: "Active",
    collectName: "No",
    collectEmail: "No",
    collectPhone: "No", 
    collectBilling: "No",
    confirmationMessage: "Default",
    callToAction: "Pay",
    allowPromotionCodes: "No"
  },
  {
    id: "pl6",
    url: "https://buy.cooperco/payment/f09g87k6-i3j4-9h7f-4k6j-3g9i0f7h2j4k",
    title: "payme asap",
    tags: "",
    createdOn: "Mar 06 2024, 03:29 PM",
    amount: "Any Amount",
    status: "Active",
    collectName: "No",
    collectEmail: "No",
    collectPhone: "No",
    collectBilling: "No",
    confirmationMessage: "Default",
    callToAction: "Pay",
    allowPromotionCodes: "No"
  },
  {
    id: "pl7",
    url: "https://buy.cooperco/payment/g10h98l7-j4k5-0i8g-5l7k-4h0j1g8i3k5l",
    title: "T-shirt Payment",
    tags: "",
    createdOn: "May 02 2024, 10:22 AM",
    amount: "10.0 USDC",
    status: "Active",
    collectName: "Yes",
    collectEmail: "Yes",
    collectPhone: "No",
    collectBilling: "Yes",
    confirmationMessage: "Your t-shirt will be shipped soon!",
    callToAction: "Buy Now",
    allowPromotionCodes: "Yes"
  }
];

export default function PaymentLinks() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter()
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPaymentLinks(placeholderPaymentLinks);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const truncateUrl = (url: string) => {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + "...";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "text-green-600 bg-green-50";
      case "inactive": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const activeLinks = paymentLinks.filter(link => link.status === "Active").length;
  const deactivatedLinks = paymentLinks.filter(link => link.status === "Inactive").length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Payment links</h1>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Create payment link
          </Button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">All payment links</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-sm text-gray-600">Deactivated</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>URL</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created on</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[100px]">More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-8 bg-gray-200 rounded w-8"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment links</h1>
        <Button 
          onClick={() => router.push("/payment-links/create")}
          data-testid="button-create-payment-link"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create payment link
        </Button>
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">{paymentLinks.length}</span>
          <span className="text-sm text-gray-600">All payment links</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">{activeLinks}</span>
          <span className="text-sm text-gray-600">Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">{deactivatedLinks}</span>
          <span className="text-sm text-gray-600">Deactivated</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>URL</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created on</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[100px]">More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentLinks.map((link) => (
              <Sheet key={link.id}>
                <SheetTrigger asChild>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    data-testid={`row-payment-link-${link.id}`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 hover:text-blue-800">
                          {truncateUrl(link.url)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(link.url);
                          }}
                          data-testid={`button-copy-url-${link.id}`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{link.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">{link.tags}</TableCell>
                    <TableCell className="text-sm text-gray-500">{link.createdOn}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-900">{link.amount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" data-testid={`button-menu-${link.id}`}>
                        ⋯
                      </Button>
                    </TableCell>
                  </TableRow>
                </SheetTrigger>
              
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-lg font-semibold">{link.title}</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge className={getStatusColor(link.status)}>
                        {link.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Amount</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-sm text-gray-900">{link.amount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">URL</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 font-mono truncate max-w-[200px]">
                          {link.url}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(link.url)}
                          data-testid={`button-copy-url-sheet-${link.id}`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(link.url, '_blank')}
                          data-testid={`button-open-url-${link.id}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Configuration</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Created on</span>
                        <span className="text-sm text-gray-900">{link.createdOn}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Collect name</span>
                        <span className="text-sm text-gray-900">{link.collectName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Collect email</span>
                        <span className="text-sm text-gray-900">{link.collectEmail}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Collect phone</span>
                        <span className="text-sm text-gray-900">{link.collectPhone}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Collect billing</span>
                        <span className="text-sm text-gray-900">{link.collectBilling}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Confirmation page message</span>
                        <span className="text-sm text-gray-900">{link.confirmationMessage}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Call to action</span>
                        <span className="text-sm text-gray-900">{link.callToAction}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Allow promotion codes</span>
                        <span className="text-sm text-gray-900">{link.allowPromotionCodes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
