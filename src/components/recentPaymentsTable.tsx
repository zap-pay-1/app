"use client"

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, RefreshCw, Copy, ExternalLink, Clock, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { sBTClOGO, SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";
import { PAYMENT, PAYMENT_DATA } from "@/types/types";
import { truncateMiddle } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";


export default function RecentPaymentsTable() {

  const {userId} = useAuth()
  const fetchUserPayments = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}payments/${userId}?limit=5`)
    return res.data
  }

  const {data, isLoading, refetch, isRefetching, isPending} = useQuery<PAYMENT_DATA>({
    queryKey : ['payments'],
    queryFn : fetchUserPayments,
    enabled : !!userId
  })

    const handleRefresh = () => {
    if (!isLoading) {
      refetch();
    } 
  };


  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "comfirmed": return "default";
      case "pending": return "secondary"; 
      case "expired": return "destructive";
      case "refunded": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "comfirmed": return "text-green-600 bg-green-50";
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
      case "stacks": return(
        <Avatar className="rounded-full w-6 h-6">
           <AvatarImage
          src={sBTClOGO}
          alt="BTC"
        />
        </Avatar>)
      default:
        return <div className={`${baseClasses} bg-gray-500`}>?</div>;
    }
  };


  if (isLoading || isRefetching || isPending) {
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

   console.log("Pyaments data", data?.payments)

  return (
        <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700"
            data-testid="button-refresh-transactions"
          >
            Refresh
          </Button>
          <Link href="/transactions">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/90"
              data-testid="link-view-all-transactions"
            >
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
       <CardContent className="p-0">
    <div className="space-y-6">

{data?.payments ?
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
            {data?.payments.map((transaction : PAYMENT) => (
              <Sheet key={transaction.id}>
                <SheetTrigger asChild>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    data-testid={`row-transaction-${transaction.id}`}
                  >
                    <TableCell className="text-sm text-gray-900">{"Jul 10 2025"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                       <Avatar className="rounded-full w-4 h-4">
                         <AvatarImage
          src={sBTClOGO}
          alt="BTC"
        /></Avatar>
                        <span className="text-sm font-medium text-gray-900">{transaction.amount} Sats</span>
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
                    <TableCell className="text-sm text-gray-900">{transaction.paymentLink ?  truncateMiddle(transaction.paymentLink.title, 24,10) : transaction.metadata ? truncateMiddle(transaction.metadata?.note, 24,10) : "---"}</TableCell>
                    <TableCell className="text-sm text-gray-500">{transaction.collectedData?.email || transaction.collectedData?.name || "---"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getNetworkIcon("stacks")}
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
                      <Avatar className="rounded-full w-4 h-4">
                         <AvatarImage
          src={sBTClOGO}
          alt="BTC"
        />
         </Avatar>
                      <SheetTitle className="text-lg font-semibold">{transaction.amount} Sats</SheetTitle>
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
                      <span className="text-sm text-gray-900">{"Jul 10 2025"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">One time</span>
                      <span className="text-sm text-gray-900">{"One Time"}</span>
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
                          <span className="text-sm text-gray-900">{transaction.paymentLink ? transaction.paymentLink.type : "Checkout"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Title</span>
                          <span className="text-sm text-gray-900">{transaction.paymentLink ? transaction.paymentLink.title : transaction.metadata?.note}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm text-gray-500">Description</span>
                          <p className="text-sm text-gray-900">{transaction.paymentLink ? truncateMiddle(transaction.paymentLink.description, 18, 9) : ""}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Created on</span>
                          <span className="text-sm text-gray-900">{"Jul 10 2025"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect name</span>
                          <span className="text-sm text-gray-900">{transaction.ollectFields?.name ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect email</span>
                          <span className="text-sm text-gray-900">{transaction.ollectFields?.email ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Collect phone</span>
                          <span className="text-sm text-gray-900">{transaction.ollectFields?.phone ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Shipping Address</span>
                          <span className="text-sm text-gray-900">{transaction.ollectFields?.shipping ? "Yes" : "No"}</span>
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
                              <span className="text-sm text-gray-900 font-mono">{truncateMiddle(transaction.id, 13, 8)}</span>
                              <Button variant="ghost" size="sm" data-testid={`button-copy-tx-id-${transaction.id}`}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Network</span>
                            <div className="flex items-center space-x-2">
                              {getNetworkIcon("stacks")}
                              <span className="text-sm text-gray-900">{"Stack"}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Transaction Hash</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-blue-600 font-mono">{truncateMiddle(transaction.txid, 13, 8)}</span>
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
                              <span className="text-sm text-blue-600 font-mono">{truncateMiddle(transaction.txid, 13, 8)}</span>
                              <Button variant="ghost" size="sm">
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Withdrawal address</span>
                            <span className="text-sm text-gray-900 font-mono">{ transaction.user.wallets ?  truncateMiddle(transaction.user.wallets[0].address, 13, 8) : "---"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Payment address</span>
                            <span className="text-sm text-gray-900 font-mono">{"---"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Payment Processing fee (1%)</span>
                            <span className="text-sm text-gray-900">{"0.00"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Discount</span>
                            <span className="text-sm text-gray-900">{"0.00"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Transaction/Gas Fees</span>
                            <span className="text-sm text-gray-900">{"0.00"}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Net amount</span>
                            <span className="text-sm font-medium text-gray-900">{transaction.amount} Sats</span>
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
 : (
   <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-xs text-gray-500 mb-4">
              Transactions will appear here once you start receiving payments
            </p>
            <Link href="/dashboard/payment-links/create">
              <Button size="sm" data-testid="button-create-payment-link">
                Create Payment Link
              </Button>
            </Link>
          </div>
 )}
    </div>
    </CardContent>
    </Card>

  );
}
