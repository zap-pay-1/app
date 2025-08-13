import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, CreditCard, TrendingUp, ExternalLink } from "lucide-react";

interface StatsGridProps {
  stats?: {
    totalVolume: string;
    transactions: number;
    successRate: string;
    activeLinks: number;
  };
  onCreatePaymentLink: () => void;
}

export default function StatsGrid({ stats, onCreatePaymentLink }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-total-volume">
                {stats?.totalVolume || "0.00"} BTC
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bitcoin className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+0% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-transactions">
                {stats?.transactions || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+0% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-success-rate">
                {stats?.successRate || "0"}%
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">No data yet</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Links</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-active-links">
                {stats?.activeLinks || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
              onClick={onCreatePaymentLink}
              data-testid="link-create-first-link"
            >
              Create your first link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
