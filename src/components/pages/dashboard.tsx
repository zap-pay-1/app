
"use client"
import { useQuery } from "@tanstack/react-query";
import IntegrationCards from "@/components/integration-cards";
import StatsGrid from "@/components/stats-grid";
import TransactionsTable from "@/components/transactions-table";
import CreatePaymentLinkModal from "@/components/modals/create-payment-link-modal";
import { useState } from "react";
import type { Transaction } from "../../shared/schema";
import RecentTransactions from "../recent-transactions";
import { PAYMENT_DATA, STATS } from "@/types/types";
import RecentPaymentsTable from "../recentPaymentsTable";
import { useRouter } from "next/navigation";
type Props = {
 stats : STATS
}
export default function Dashboard({stats} : Props) {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

 const navigateToCreateLink = () => {
    router.push("/dashboard/payment-links/create")
 }
  return (
    <div className="space-y-8">
      <IntegrationCards onCreatePaymentLink={navigateToCreateLink} />
      <StatsGrid stats={stats} onCreatePaymentLink={navigateToCreateLink} />
      
      <div className="grid grid-cols-1  gap-8">
       
        <div className="lg:col-span-1">
       <RecentPaymentsTable />
        </div>
      </div>
      
      <CreatePaymentLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
