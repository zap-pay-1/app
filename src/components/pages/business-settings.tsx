/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useUpsertBusiness } from "@/hooks/useBusinessUpsert";
import { CountryWithPhoneCode, useCountriesWithPhoneCodes } from "@/hooks/useGetCountries";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { USER_BUSINESSES } from "@/types/types";

type Props = {
  showBackBtn? : boolean
}
export default function BusinessSettings({showBackBtn = true} : Props) {
const {userId } = useAuth()
const { mutate: upsertBusiness, isError, data, error , isPending} = useUpsertBusiness();
  const { data: countries =[], isLoading, isError: isCountriesError, error: countriesError } = useCountriesWithPhoneCodes();

  const fetchUserBusineses = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}business/user/${userId}`)
    return res.data
  }
const {data: businesses, isLoading: businessLoading, error: businessError} = useQuery<USER_BUSINESSES>({
queryKey : ["businesses"],
queryFn : fetchUserBusineses,
enabled : !!userId
})
  const [formData, setFormData] = useState({
  businessName: "",
  country: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  notificationEmail: "",
  supportEmail: "",
  countryCode: "",
  businessPhone: "",
  website: "",
  companyIdentificationNumber: "",
  taxIdentificationNumber: ""
});

useEffect(() => {
  if (businesses?.businesses?.[0]) {
    const b = businesses.businesses[0];
    setFormData({
      businessName: b.name || "",
      country: b.country || "",
      addressLine1: b.addressLine1 || "",
      addressLine2: b.addressLine2 || "",
      city: b.city || "",
      state: b.state || "",
      zipCode: b.zipCode || "",
      notificationEmail: b.notificationEmail || "",
      supportEmail: b.supportEmail || "",
      countryCode: b.countryCode || "",
      businessPhone: b.businessPhone || "",
      website: b.website || "",
      companyIdentificationNumber: b.companyIdentificationNumber || "",
      taxIdentificationNumber: b.taxIdentificationNumber || ""
    });
  }
}, [businesses]);


  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSaveChanges = () => {
    const info = {
        ...formData,
        clerkId : userId!
    }
   upsertBusiness(info)
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        { showBackBtn &&
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
}
        <Button onClick={handleSaveChanges} data-testid="button-save-changes" disabled={isPending || !formData.businessName} className={`${!showBackBtn ? "ml-auto" : ""}`}>
        {isPending ? "Loading..." : "Save changes"}
        </Button>
      </div>

      {/* Business Details Card */}
      <Card>
        <CardHeader className="">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Business details
          </CardTitle>
          <p className="text-sm text-gray-500">
            This information helps customers recognize your business, understand your products and terms of service.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
              Business name
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Your public business information will be used on Checkout page, invoices and receipts. Please make sure it&apos;s correct.
            </p>
            <Input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className="max-w-md"
              data-testid="input-business-name"
            />
          </div>

          {/* Business Address */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Business address
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
               {
                //@ts-ignore
               (countries ?? []).map((item: CountryWithPhoneCode, i) => (
                   <SelectItem key={i} value={item.name}>{item.name}</SelectItem>
               ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Address line 1"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
              data-testid="input-address-line-1"
            />

            <Input
              placeholder="Address line 2"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange("addressLine2", e.target.value)}
              data-testid="input-address-line-2"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                data-testid="input-city"
              />
              <Input
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                data-testid="input-state"
              />
              <Input
                placeholder="Zip/Pin code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                data-testid="input-zip-code"
              />
            </div>
          </div>

          {/* Notification Email */}
          <div className="space-y-2">
            <Label htmlFor="notificationEmail" className="text-sm font-medium text-gray-700">
              Notification email
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Email that is used for payment notifications.
            </p>
            <div className="relative max-w-md">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="notificationEmail"
                type="email"
                placeholder="Business email"
                value={formData.notificationEmail}
                onChange={(e) => handleInputChange("notificationEmail", e.target.value)}
                className="pl-10"
                data-testid="input-notification-email"
              />
            </div>
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="text-sm font-medium text-gray-700">
              Support email
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              A support email is essential for customers who encounter any issues during the checkout process.
            </p>
            <div className="relative max-w-md">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="supportEmail"
                type="email"
                placeholder="Support email for customers"
                value={formData.supportEmail}
                onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                className="pl-10"
                data-testid="input-support-email"
              />
            </div>
          </div>

          {/* Support Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="businessPhone" className="text-sm font-medium text-gray-700">
              Support phone number
            </Label>
            <div className="flex max-w-md space-x-2">
              <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                <SelectTrigger className="w-20" data-testid="select-country-code">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
           {
            //@ts-ignore
           (countries ?? []).map((item: CountryWithPhoneCode, i) => (
            <SelectItem key={i} value={item.phoneCode}>{item.phoneCode}</SelectItem>
           ))}
                </SelectContent>
              </Select>
              <Input
                id="businessPhone"
                type="tel"
                placeholder="Business phone"
                value={formData.businessPhone}
                onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                className="flex-1"
                data-testid="input-business-phone"
              />
            </div>
          </div>

          {/* Business Website */}
          <div className="space-y-2">
            <Label htmlFor="businessWebsite" className="text-sm font-medium text-gray-700">
              Business website
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              If you don&apos;t have a website, you can enter a social media page.
            </p>
            <Input
              id="businessWebsite"
              type="url"
              placeholder="e.g. https://yoursite.io"
              value={formData.website}
              onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
              className="max-w-md"
              data-testid="input-business-website"
            />
          </div>

          {/* Company Identification Number */}
          <div className="space-y-2">
            <Label htmlFor="companyId" className="text-sm font-medium text-gray-700">
              Company Identification number
            </Label>
            <Input
              id="companyId"
              type="text"
              placeholder="Company Identification number"
              value={formData.companyIdentificationNumber}
              onChange={(e) => handleInputChange("companyIdentificationNumber", e.target.value)}
              className="max-w-md"
              data-testid="input-company-id"
            />
          </div>

          {/* TAX Identification Number */}
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-sm font-medium text-gray-700">
              TAX Identification Number
            </Label>
            <Input
              id="taxId"
              type="text"
              placeholder="TAX Identification Number"
              value={formData.taxIdentificationNumber}
              onChange={(e) => handleInputChange("taxIdentificationNumber", e.target.value)}
              className="max-w-md"
              data-testid="input-tax-id"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}