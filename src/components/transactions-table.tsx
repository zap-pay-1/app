import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Plus } from "lucide-react";
import type { Transaction } from "@shared/schema";

interface TransactionsTableProps {
  transactions: Transaction[];
  onCreatePaymentLink: () => void;
}

export default function TransactionsTable({ transactions, onCreatePaymentLink }: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center space-x-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-40" data-testid="select-transaction-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="payment-links">Payment Links</SelectItem>
                <SelectItem value="api-payments">API Payments</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" className="text-primary hover:text-indigo-600 font-medium" size="sm">
              View all
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your Bitcoin payment transactions will appear here once you start receiving payments.
            </p>
            <Button onClick={onCreatePaymentLink} data-testid="button-create-first-payment">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Payment Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.amount} {transaction.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
