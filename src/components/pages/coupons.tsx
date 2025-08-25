"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Search, Plus, Calendar, Info, X, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { COUPONS } from "@/types/types";
import { formatDate } from "date-fns";
interface Coupon {
  id: string;
  name: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  redemptions: number;
  created: string;
  expires: string;
  status: "active" | "expired" | "disabled";
}

// Mock data for coupons
const mockCoupons: Coupon[] = [
  {
    id: "1",
    name: "Summer Campaign",
    code: "SUMMER20",
    type: "percentage",
    value: 20,
    redemptions: 145,
    created: "Jun 15, 2024",
    expires: "Aug 31, 2024",
    status: "active"
  },
  {
    id: "2",
    name: "New Customer Discount",
    code: "WELCOME10",
    type: "fixed",
    value: 10,
    redemptions: 89,
    created: "May 1, 2024",
    expires: "Dec 31, 2024",
    status: "active"
  }
];

export default function CouponCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {userId} = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    pricingType: "percentage" as "percentage" | "fixed",
    percentageOff: 0,
    fixedAmount: 0,
    expiresBy: "",
    redemptionLimit: 0,
    lifetimePromo: false
  });

   console.log("Forma data", formData)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const createCoupons = async() => {
      const res = await axios.post(`${SERVER_EDNPOINT_URL}coupons/add`, {
        name :  formData.name,
        code :  formData.code,
        value : formData.pricingType === "fixed" ? Number(formData.fixedAmount) :  Number(formData.percentageOff),
        type : formData.pricingType === "fixed" ? "fixed_amount" :  "percentage",
        expireAt : formData.expiresBy,
        limit :  Number(formData.redemptionLimit),
       clerkId : userId
      })
      return res
    }
 const fetchCoupons = async () => {
   const res = await axios.get(`${SERVER_EDNPOINT_URL}coupons/user/${userId}`)
   return res.data
 }
     const mutate = useMutation({
      mutationFn : createCoupons,
      mutationKey : ["coupons"],
      onSuccess : () => {
        toast({
          title : "Coupon created succefully",
          description : "Coupon created succefully"
        })

        queryClient.invalidateQueries({queryKey : ["coupons"]})
      },
      onError : (error) => {
         toast({
          title : "Something Went wrong",
          description : "Something Went wrong",
          variant : "destructive"
        })
      }
     })

      const {data, isLoading} = useQuery<COUPONS>({
    queryKey : ['coupons'],
    queryFn : fetchCoupons,
    enabled : !!userId
      })
       console.log("coupons :", data)
  const handleCreateCoupon =  async () => {
    // Create new coupon logic
    /*const newCoupon: Coupon = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      type: formData.pricingType,
      value: formData.pricingType === "percentage" 
        ? parseFloat(formData.percentageOff) 
        : parseFloat(formData.fixedAmount),
      redemptions: 0,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      expires: formData.lifetimePromo ? "Never" : new Date(formData.expiresBy).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "active"
    };*/

    //setCoupons(prev => [newCoupon, ...prev]);
   await mutate.mutateAsync()
    setIsCreateModalOpen(false);
    
    // Reset form
    setFormData({
      name: "",
      code: "",
      pricingType: "percentage",
      percentageOff: 0,
      fixedAmount: 0,
      expiresBy: "",
      redemptionLimit: 0,
      lifetimePromo: false
    });
  };

  const filteredCoupons = data?.coupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      case "disabled":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Disabled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

   if(isLoading){
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="text-gray-700 w-8 h-8 animate-spin"   />
    </div>
   }
  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or coupon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
              data-testid="input-search-coupons"
            />
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-coupon">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Promocode</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Summer Campaign"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    data-testid="input-coupon-name"
                  />
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g. JUNE20"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    data-testid="input-coupon-code"
                  />
                </div>

                {/* Pricing Type */}
                <div className="space-y-2">
                  <Label>Pricing type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={formData.pricingType === "percentage" ? "default" : "outline"}
                      onClick={() => handleInputChange("pricingType", "percentage")}
                      data-testid="button-percentage-type"
                    >
                      Percentage
                    </Button>
                    <Button
                      type="button"
                      variant={formData.pricingType === "fixed" ? "default" : "outline"}
                      onClick={() => handleInputChange("pricingType", "fixed")}
                      data-testid="button-fixed-type"
                    >
                      Fixed Amount
                    </Button>
                  </div>
                </div>

                {/* Percentage Off / Fixed Amount */}
                {formData.pricingType === "percentage" ? (
                  <div className="space-y-2">
                    <Label htmlFor="percentageOff">Percentage off</Label>
                    <div className="relative">
                      <Input
                        id="percentageOff"
                        type="number"
                        placeholder="0.00"
                        value={formData.percentageOff}
                        onChange={(e) => handleInputChange("percentageOff", e.target.value)}
                        className="pr-8"
                        data-testid="input-percentage-off"
                      />
                      <X className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="fixedAmount">Fixed Amount</Label>
                    <Input
                      id="fixedAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.fixedAmount}
                      onChange={(e) => handleInputChange("fixedAmount", e.target.value)}
                      data-testid="input-fixed-amount"
                    />
                  </div>
                )}

                {/* Expired By */}
                <div className="space-y-2">
                  <Label htmlFor="expiresBy">Expired By</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="expiresBy"
                      type="date"
                      value={formData.expiresBy}
                      onChange={(e) => handleInputChange("expiresBy", e.target.value)}
                      className="pl-10"
                      disabled={formData.lifetimePromo}
                      data-testid="input-expires-by"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lifetimePromo"
                      checked={formData.lifetimePromo}
                      onChange={(e) => handleInputChange("lifetimePromo", e.target.checked)}
                      className="rounded"
                      data-testid="checkbox-lifetime-promo"
                    />
                    <Label htmlFor="lifetimePromo" className="text-sm text-gray-600">
                      Promocode going to be valid for lifetime
                    </Label>
                  </div>
                </div>

                {/* Redemption Limit */}
                <div className="space-y-2">
                  <Label htmlFor="redemptionLimit" className="flex items-center space-x-1">
                    <span>Redemption Limit</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Optional</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="redemptionLimit"
                      type="number"
                      placeholder="e.g. 1"
                      value={formData.redemptionLimit}
                      onChange={(e) => handleInputChange("redemptionLimit", e.target.value)}
                      className="flex-1"
                      data-testid="input-redemption-limit"
                    />
                    <span className="text-sm text-gray-500">time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      This limit applies across customers so it won&apos;t prevent single customer from redeeming multiple times.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    data-testid="button-cancel-coupon"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCoupon}
                    disabled={!formData.name || !formData.code || mutate.isPending}
                    data-testid="button-create-coupon"
                  >
                    {mutate.isPending ? "Loading..." : "Add Promocode"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promocodes</h1>
      </div>

      {/* Alert */}
      <Alert className="bg-orange-50 border-orange-200">
        <Info className="w-4 h-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          Promocodes is only applicable for one-time products.
        </AlertDescription>
      </Alert>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Coupon</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons && filteredCoupons?.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id} data-testid={`row-coupon-${coupon.id}`}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{coupon.name}</div>
                        <div className="text-sm text-gray-500 uppercase">{coupon.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-gray-600">
                        {coupon.couponType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">
                        {coupon.couponType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge("active")}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{coupon.timesRedeemed}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{formatDate(coupon.createdAt, "yyyy/MM/dd")}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{"Unlimited"}</span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        data-testid={`button-coupon-menu-${coupon.id}`}
                      >
                        ⋯
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm ? "No coupons found matching your search." : "No coupons created yet."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}