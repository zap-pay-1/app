import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";

const settingsOptions = [
  {
    title: "Account Details",
    description: "Manage your personal account information and preferences",
    icon: User,
    href: "/dashboard//settings/account",
    testId: "link-account-settings"
  },
  {
    title: "Business Settings", 
    description: "Configure your business information and contact details",
    icon: Building,
    href: "/dashboard/settings/business",
    testId: "link-business-settings"
  },
  {
    title: "Coupon Codes",
    description: "Create and manage promotional codes for your customers",
    icon: Tag,
    href: "/dashboard/settings/coupons",
    testId: "link-coupon-settings"
  }
];

export default function SettingsList() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and business preferences</p>
      </div>

      {/* Settings Options */}
      <div className="grid grid-cols-3 gap-4">
        {settingsOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Link key={option.href} href={option.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}