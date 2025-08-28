"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PAYMENT_DATA } from "@/types/types";
import Payments from "./pages/payments";
import RecentPaymentsTable from "./recentPaymentsTable";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Transaction status types and colors
const statusConfig = {
  completed: { 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-800 hover:bg-green-100", 
    label: "Completed" 
  },
  pending: { 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", 
    label: "Pending" 
  },
  failed: { 
    icon: XCircle, 
    color: "bg-red-100 text-red-800 hover:bg-red-100", 
    label: "Failed" 
  },
  processing: { 
    icon: AlertCircle, 
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100", 
    label: "Processing" 
  }
};

type TransactionStatus = keyof typeof statusConfig;

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  customerEmail: string;
  createdAt: string;
  paymentLinkTitle?: string;
}

type Props = {
  data : PAYMENT_DATA
}
function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const statusInfo = statusConfig[transaction.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <StatusIcon className={`w-5 h-5 ${transaction.status === 'completed' ? 'text-green-600' : 
            transaction.status === 'pending' ? 'text-yellow-600' : 
            transaction.status === 'failed' ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900" data-testid={`transaction-email-${transaction.id}`}>
            {transaction.customerEmail}
          </p>
          <p className="text-sm text-gray-500" data-testid={`transaction-date-${transaction.id}`}>
            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900" data-testid={`transaction-amount-${transaction.id}`}>
          {transaction.amount} {transaction.currency}
        </p>
        <Badge 
          className={statusInfo.color}
          data-testid={`transaction-status-${transaction.id}`}
        >
          {statusInfo.label}
        </Badge>
      </div>
    </div>
  );
}

const LoadingState = () => (
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
)

export default function RecentTransactions() {
  const [showLoadingDemo, setShowLoadingDemo] = useState(true);
  const {userId} = useAuth()

  // Simulate API call with loading state demo
  const fetchRecentTxs = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}payments/${userId}`)
    return res.data
  }
  const { data, isLoading, refetch } = useQuery<PAYMENT_DATA>({
    queryKey: ['payments'],
    queryFn : fetchRecentTxs,
    enabled: !!userId,
    //retry: false,
    //refetchOnWindowFocus: false,
    //staleTime: 30000, // Keep data fresh for 30 seconds
  });

  // Demo: Show loading state for 3 seconds, then show data/empty state
  useEffect(() => {
    if (showLoadingDemo) {
      const timer = setTimeout(() => {
        setShowLoadingDemo(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoadingDemo]);

  const handleRefresh = () => {
    if (!showLoadingDemo) {
      refetch();
    } else {
      setShowLoadingDemo(true);
    }
  };

  const displayLoading = showLoadingDemo || isLoading;

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
        {data?.payments? (
        <RecentPaymentsTable data={data!} isLoading={isLoading} />
        ) : isLoading ? (
   <LoadingState />
        )
        
        : data?.payments.length === 0 &&(
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
      </CardContent>
    </Card>
  );
}