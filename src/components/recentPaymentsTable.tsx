"use client"

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";
import { PAYMENT_DATA } from "@/types/types";


// Placeholder transaction data
const placeholderTransactions = [
  {
    id: "tx1",
    date: "10 Sep",
    amount: "2.0 DAI",
    status: "Pending",
    title: "KAJU",
    customerEmail: "freewaka19@gmail.com",
    timestamp: "Jun 13 2024, 09:55 AM",
    type: "One time",
    description: "please help to donate",
    network: "Polygon",
    transactionId: "a43ae189-af60-4d8c-a162-ccd5563bc243",
    transactionHash: "0xcc0c4def2a00f",
    withdrawalHash: "0xc53db44c128e",
    withdrawalAddress: "0x345f_73c3_g",
    paymentAddress: "0xa004c_4161_g",
    processingFee: "0.0002 USDC",
    discount: "0.0 USDC",
    gasFees: "0.0 USDC",
    netAmount: "0.0196 USDC"
  },
  {
    id: "tx2", 
    date: "13 Jun",
    amount: "10.0 USDC",
    status: "Expired",
    title: "please help to donate",
    customerEmail: "-",
    timestamp: "Jun 13 2024, 09:55 AM",
    type: "One time",
    description: "this money will be used for supporting hol has",
    network: "Ethereum",
    transactionId: "b54bf290-bg71-5e9d-b273-dde6674cd354",
    transactionHash: "0xdd1d5efg3b11g",
    withdrawalHash: "0xd64ebc55d39f",
    withdrawalAddress: "0x456g_84d4_h",
    paymentAddress: "0xb115d_5272_h",
    processingFee: "0.0003 USDC",
    discount: "0.0 USDC", 
    gasFees: "0.0 USDC",
    netAmount: "0.0297 USDC"
  },
  {
    id: "tx3",
    date: "13 Jun", 
    amount: "0.02 USDC",
    status: "Paid",
    title: "please help to donate",
    customerEmail: "-",
    timestamp: "Jun 13 2024, 09:55 AM",
    type: "One time",
    description: "please help to donate",
    network: "Stacks",
    transactionId: "c65cg301-ch82-6f0e-c384-eef7785de465",
    transactionHash: "0xee2e6fgh4c22h",
    withdrawalHash: "0xe75fcd66e40g",
    withdrawalAddress: "0x567h_95e5_i",
    paymentAddress: "0xc226e_6384_i",
    processingFee: "0.0004 USDC",
    discount: "0.0 USDC",
    gasFees: "0.0 USDC", 
    netAmount: "0.0396 USDC"
  },
  {
    id: "tx4",
    date: "14 Mar",
    amount: "0.5 USDC", 
    status: "Refunded",
    title: "please help to donate",
    customerEmail: "-",
    timestamp: "Mar 14 2024, 14:32 PM",
    type: "One time",
    description: "please help to donate",
    network: "Polygon",
    transactionId: "d76dh412-di93-7g1f-d495-ffg8896ef576",
    transactionHash: "0xff3f7ghi5d33i",
    withdrawalHash: "0xf86gde77f51h",
    withdrawalAddress: "0x678i_06f6_j",
    paymentAddress: "0xd337g_7495_j",
    processingFee: "0.0005 USDC",
    discount: "0.0 USDC",
    gasFees: "0.0 USDC",
    netAmount: "0.0495 USDC"
  },
  {
    id: "tx5",
    date: "06 Mar",
    amount: "0.5 USDC",
    status: "Paid", 
    title: "please help to donate",
    customerEmail: "-",
    timestamp: "Mar 06 2024, 11:18 AM",
    type: "One time",
    description: "please help to donate",
    network: "Stacks",
    transactionId: "e87ei523-ej04-8h2g-e506-ggh9907fg687",
    transactionHash: "0xgg4g8hij6e44j",
    withdrawalHash: "0xg97hef88g62i",
    withdrawalAddress: "0x789j_17g7_k",
    paymentAddress: "0xe448h_8506_k",
    processingFee: "0.0006 USDC",
    discount: "0.0 USDC",
    gasFees: "0.0 USDC",
    netAmount: "0.0594 USDC"
  }
];

export default function RecentPaymentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
//  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const {userId} = useAuth()
  const fetchUserPayments = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}payments/${userId}`)
    return res.data
  }

  const {data, isLoading} = useQuery<PAYMENT_DATA>({
    queryKey : ['payments'],
    queryFn : fetchUserPayments
  })

  console.log(`real payments data`, data)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTransactions(placeholderTransactions);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "default";
      case "pending": return "secondary"; 
      case "expired": return "destructive";
      case "refunded": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "text-green-600 bg-green-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "expired": return "text-red-600 bg-red-50";
      case "refunded": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getNetworkIcon = (network: string) => {
    const baseClasses = "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium";
    switch (network.toLowerCase()) {
      case "polygon":
        return <div className={`${baseClasses} bg-purple-500`}>P</div>;
      case "ethereum":
        return <div className={`${baseClasses} bg-blue-500`}>E</div>;
      case "stacks":
        return <div className={`${baseClasses} bg-orange-500`}>S</div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}>?</div>;
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="default" size="sm" disabled>
              Reprocess payments
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by checkout session ID"
              className="pl-10"
              disabled
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-6 bg-gray-200 rounded-full w-16"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                  <TableCell><div className="h-5 bg-gray-200 rounded-full w-5"></div></TableCell>
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

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <Sheet key={transaction.id}>
                <SheetTrigger asChild>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    data-testid={`row-transaction-${transaction.id}`}
                  >
                    <TableCell className="text-sm text-gray-900">{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-900">{transaction.amount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(transaction.status)}
                        className={getStatusColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{transaction.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">{transaction.customerEmail}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getNetworkIcon(transaction.network)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" data-testid={`button-menu-${transaction.id}`}>
                        ⋯
                      </Button>
                    </TableCell>
                  </TableRow>
                </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <SheetTitle className="text-lg font-semibold">{transaction.amount}</SheetTitle>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-receipt">
                      <Download className="w-4 h-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge 
                        variant={getStatusVariant(transaction.status)}
                        className={getStatusColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Timestamp</span>
                      <span className="text-sm text-gray-900">{transaction.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">One time</span>
                      <span className="text-sm text-gray-900">{transaction.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Customer</span>
                      <span className="text-sm text-gray-900">Guest</span>
                    </div>
                  </div>

                  <Tabs defaultValue="payment" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="payment">Payment Details</TabsTrigger>
                      <TabsTrigger value="checkout">Checkout Session Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="payment" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Type</span>
                          <span className="text-sm text-gray-900">{transaction.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Title</span>
                          <span className="text-sm text-gray-900">{transaction.title}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Description</span>
                          <p className="text-sm text-gray-900">{transaction.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Created on</span>
                          <span className="text-sm text-gray-900">{transaction.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect name</span>
                          <span className="text-sm text-gray-900">Yes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect email</span>
                          <span className="text-sm text-gray-900">No</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect phone</span>
                          <span className="text-sm text-gray-900">No</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="checkout" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Transaction Details</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Transaction ID</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-900 font-mono">{transaction.transactionId.slice(0, 8)}...</span>
                              <Button variant="ghost" size="sm" data-testid={`button-copy-tx-id-${transaction.id}`}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Network</span>
                            <div className="flex items-center space-x-2">
                              {getNetworkIcon(transaction.network)}
                              <span className="text-sm text-gray-900">{transaction.network}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Transaction Hash</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-blue-600 font-mono">{transaction.transactionHash.slice(0, 10)}...</span>
                              <Button variant="ghost" size="sm" data-testid={`button-copy-hash-${transaction.id}`}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Withdrawal</span>
                            <span className="text-sm text-gray-900">Yes</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Withdrawal transaction hash</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-blue-600 font-mono">{transaction.withdrawalHash.slice(0, 10)}...</span>
                              <Button variant="ghost" size="sm">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Withdrawal address</span>
                            <span className="text-sm text-gray-900 font-mono">{transaction.withdrawalAddress}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Payment address</span>
                            <span className="text-sm text-gray-900 font-mono">{transaction.paymentAddress}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Payment Processing fee (1%)</span>
                            <span className="text-sm text-gray-900">{transaction.processingFee}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Discount</span>
                            <span className="text-sm text-gray-900">{transaction.discount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Transaction/Gas Fees</span>
                            <span className="text-sm text-gray-900">{transaction.gasFees}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Net amount</span>
                            <span className="text-sm font-medium text-gray-900">{transaction.netAmount}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
