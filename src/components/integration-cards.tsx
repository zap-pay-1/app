import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Webhook } from "lucide-react";
import Link from "next/link";

interface IntegrationCardsProps {
  onCreatePaymentLink: () => void;
}

export default function IntegrationCards({ onCreatePaymentLink }: IntegrationCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Payment Links Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Most Popular
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Payment Links</h3>
          <p className="text-gray-600 text-sm mb-4">
            Generate secure payment links for Bitcoin transactions via sBTC. Perfect for invoices and one-time payments.
          </p>
          <div className="space-y-3 mb-6">
            <Button 
              onClick={onCreatePaymentLink} 
              className="w-full"
              data-testid="button-create-payment-link"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Create Payment Link
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-view-demo">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
              View Demo
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            <span>12 active links</span> • <span>0.5 BTC collected</span>
          </div>
        </CardContent>
      </Card>

      {/* API Integration Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-800 text-xs">
              Developer
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Integration</h3>
          <p className="text-gray-600 text-sm mb-4">
            Integrate sBTC payments directly into your application with our RESTful API and comprehensive documentation.
          </p>
          <div className="space-y-3 mb-6">
            <Link href="/api-keys">
              <Button className="w-full" data-testid="button-manage-api-keys">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7,14A3,3 0 0,0 10,17A3,3 0 0,0 13,14A3,3 0 0,0 10,11A3,3 0 0,0 7,14M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65Z"/>
                </svg>
                Manage API Keys
              </Button>
            </Link>
            <Button variant="outline" className="w-full" data-testid="button-view-docs">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.9,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3M6,17H8.5L13.5,9H11L8,14.5L6,9H8.5L11,14.5L13.5,9H16L11,17H6Z"/>
                </svg>
              View Documentation
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            <span>1.2k API calls</span> • <span>Last 30 days</span>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Webhook className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-gray-100 text-gray-800 text-xs">
              Real-time
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Webhook Events</h3>
          <p className="text-gray-600 text-sm mb-4">
            Receive real-time notifications about payment status changes, confirmations, and failed transactions.
          </p>
          <div className="space-y-3 mb-6">
            <Link href="/webhooks">
              <Button className="w-full" data-testid="button-configure-webhooks">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                </svg>
                Configure Webhooks
              </Button>
            </Link>
            <Button variant="outline" className="w-full" data-testid="button-event-history">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
                </svg>
              Event History
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            <span>3 endpoints</span> • <span>99.8% success</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
