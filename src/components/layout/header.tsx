import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import CreatePaymentLinkModal from "@/components/modals/create-payment-link-modal";

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case "/":
      return {
        title: "Dashboard",
        description: "Manage your sBTC payment integration",
      };
    case "/payment-links":
      return {
        title: "Payment Links",
        description: "Create and manage payment links for your customers",
      };
    case "/transactions":
      return {
        title: "Transactions",
        description: "Track all your sBTC payment transactions",
      };
    case "/api-keys":
      return {
        title: "API & Keys",
        description: "Manage your API keys for programmatic access",
      };
    case "/webhooks":
      return {
        title: "Webhooks",
        description: "Receive real-time notifications about payment events",
      };
    case "/analytics":
      return {
        title: "Analytics",
        description: "View detailed analytics and insights",
      };
    default:
      return {
        title: "Dashboard",
        description: "Manage your sBTC payment integration",
      };
  }
};

export default function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  //const pageInfo = getPageInfo(location);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{"Page title"}</h1>
            <p className="text-sm text-gray-500 mt-1">{"page description"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              data-testid="button-create-payment"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Payment
            </Button>
          </div>
        </div>
      </header>

      <CreatePaymentLinkModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
}
