
"use client"
import { useQuery } from "@tanstack/react-query";
import IntegrationCards from "@/components/integration-cards";
import StatsGrid from "@/components/stats-grid";
import TransactionsTable from "@/components/transactions-table";
import CreatePaymentLinkModal from "@/components/modals/create-payment-link-modal";
import { useState } from "react";
import type { Transaction } from "../../shared/schema";
import RecentTransactions from "../recent-transactions";

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: stats } = useQuery<{
    totalVolume: string;
    transactions: number;
    successRate: string;
    activeLinks: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  return (
    <div className="space-y-8">
      <IntegrationCards onCreatePaymentLink={() => setIsCreateModalOpen(true)} />
      <StatsGrid stats={stats} onCreatePaymentLink={() => setIsCreateModalOpen(true)} />
      
      <div className="grid grid-cols-1  gap-8">
       
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
      
   <div className="">
          <TransactionsTable 
            transactions={transactions} 
            onCreatePaymentLink={() => setIsCreateModalOpen(true)} 
          />
        </div>
      <CreatePaymentLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
