"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { USER, USER_DATA } from "@/types/types";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Props = {
  data : USER_DATA
}
export default function AccountSettings({data} : Props) {
  const {user} = useUser()
  const emailAddress =  user?.primaryEmailAddress?.emailAddress
   const userId = user?.id
  const [formData, setFormData] = useState({
    firstName: data.user.first_name || "",
    lastName: data.user.last_name || "",
    walletAddress :  data?.user.wallets && data?.user.wallets[0].address || "",
    email: emailAddress //"user@company.com"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

   const handleMutate = async () => {
    const res = await axios.patch(`${SERVER_EDNPOINT_URL}users/${userId}`,{
      first_name : formData.firstName,
      last_name : formData.lastName,
      walletAddress : formData.walletAddress,
      clerkId : userId
    })
    return res
   }

    const mutate = useMutation({
      mutationFn : handleMutate,
      mutationKey : ['settings'],
      onSuccess : () => {
        toast({
          title : "Account setting  saved",
          description : "Account details changed  succefully"
        })
      },
      onError : (err) => {
         toast({
          title : "Something went wrong",
          description : err.message
        })
        console.log(err)
      }

    })
  const handleSaveChanges = async () => {
    // Handle save logic here
    await mutate.mutateAsync()
    console.log("Saving changes:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
        <Button onClick={handleSaveChanges} data-testid="button-save-changes" disabled={mutate.isPending}>
         {mutate.isPending ? "Loading..." : " Save changes"}
        </Button>
      </div>

      {/* Account Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Account details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="max-w-md"
              data-testid="input-first-name"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="max-w-md"
              data-testid="input-last-name"
            />
          </div>
          
          {/* Wallet address */}
          <div className="space-y-2">
            <Label htmlFor="walletAddress" className="text-sm font-medium text-gray-700">
              Wallet Address (Stack network)
            </Label>
            <Input
              id="walletAddress"
              type="text"
              placeholder="Wallet Address"
              value={formData.walletAddress}
              onChange={(e) => handleInputChange("walletAddress", e.target.value)}
              className="max-w-md"
              data-testid="wallet-address"
            />
          </div>

          {/* Email ID */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Id
            </Label>
            <div className="text-sm text-gray-600 max-w-md">
              {emailAddress}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}