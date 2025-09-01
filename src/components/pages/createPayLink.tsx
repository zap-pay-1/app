"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Check, Sparkles, ExternalLink, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { formSchema } from "@/lib/formSchema";
import { useCreatePaymentLink } from "@/hooks/useCreatePayLink";
import { useAuth } from "@clerk/clerk-react";
import { StickyInfoBanner } from "../stick-info-banner";
import { USER_DATA } from "@/types/types";
import { HOSTED_URL } from "@/lib/constants";

type FormData = z.infer<typeof formSchema>;

type Props = {
  data : USER_DATA
}
const tagOptions = ["Donation", "Freelance", "Payment"];
const suggestionAmounts = ["5", "10", "25", "50", "100"];
 
export default function CreatePaymentLink({data} : Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();
  const {userId} = useAuth()
 const router = useRouter()
   const { mutate: createPaymentLink, isPending } = useCreatePaymentLink();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkType: "fixed",
      currency: "sBTC",
      enableSuggestions: false,
      clerkId : userId!,
      suggestions: [],
      title: "",
      description: "",
      collectName: false,
      collectEmail: false,
      collectPhone: false,
      collectBilling: false,
      collectShipping: false,
      collectCustomFields: false,
      tags: "",
      btnText: "pay",
      acceptPaymentOn: ["ethereum", "polygon"],
    },
  });

    console.log("user information from client", data)
  const watchedValues = form.watch();
  const isImageUploaded = form.watch("image")

  // Live preview data
  const previewData = {
    title: watchedValues.title || "Untitled Payment Link",
    description: watchedValues.description || "Payment for goods/services",
    amount: watchedValues.linkType === "fixed" ? watchedValues.amount : "0.5",
    currency: watchedValues.currency,
    callToAction: watchedValues.btnText,
    showSuggestions: watchedValues.linkType === "custom" && watchedValues.enableSuggestions,
    suggestions: watchedValues.suggestions,
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const metadata = {
 ...data,
 clerkId : userId!
    }
      createPaymentLink(metadata, {
      onSuccess: (res) => {
        console.log("Payment link created:", res);
        // maybe redirect or show toast
          const linkId = res?.paymentLink?.id;
    const link = `${HOSTED_URL}payment/payment-link/${linkId}`;
    setGeneratedLink(link);
    setShowSuccess(true);
      },
      onError: (err) => {
       toast({
        title : "Something went wrong",
        description : "Your payment link wasn’t generated. Make sure your setup is complete and try again.",
        variant : "destructive"
       })
      },
          onSettled: () => {
      // onSettled runs after success or error — good place to reset loading states
      setIsSubmitting(false);
    },
    });
  
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({ title: "Link copied to clipboard!" });
  };


  const toggleSuggestion = (amount: string) => {
    const currentSuggestions = form.getValues("suggestions");
    if (currentSuggestions.includes(amount)) {
      form.setValue("suggestions", currentSuggestions.filter(s => s !== amount));
    } else {
      form.setValue("suggestions", [...currentSuggestions, amount]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Optional: add size/type checks here
  if (file.size > 5 * 1024 * 1024) {
    alert('File is too big (max 5MB)');
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('products') // your bucket name
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('products')
    .getPublicUrl(fileName);

  const publicUrl = publicUrlData.publicUrl;

  // Update form value
  form.setValue('image', publicUrl);

  console.log('Uploaded image URL:', publicUrl);
};

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Created!</h1>
            <p className="text-gray-600 mb-6">Your payment link is ready to share with customers.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">Your payment link:</p>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-white px-3 py-2 rounded border flex-1 text-left">
                  {generatedLink}
                </code>
                <Button size="sm" onClick={copyLink} data-testid="button-copy-generated-link">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(generatedLink, '_blank')} 
                className="w-full"
                data-testid="button-view-payment-link"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Payment Link
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSuccess(false)} 
                className="w-full"
                data-testid="button-create-another"
              >
                Create Another Link
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {! data.user.wallets &&
      <StickyInfoBanner
       message="You haven't completed your business setup yet 🚀. Add your business info and connect your payment method to start accepting BTC payments today." 
       />
      }
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="mb-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Payment Link</h1>
          <p className="text-gray-600">Set up a new payment link to start accepting sBTC payments</p>
        </div>

        <div className="flex items-center justify-center ">
          {/* Form Section */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Link Type */}
                <Card className="w-[600px]">
                  <CardHeader>
                    <CardTitle className="text-lg">Link Type</CardTitle>
                    <CardDescription>Choose how customers will pay</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="linkType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-link-type">
                                <SelectValue placeholder="Select payment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed amount</SelectItem>
                              <SelectItem value="custom">Customer chooses amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedValues.linkType === "fixed" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="0.00" 
                                  type="number" 
                                  step="0.01"
                                  {...field} 
                                  data-testid="input-amount"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-currency">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="STX">STX</SelectItem>
                                  <SelectItem value="sBTC">sBTC</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {watchedValues.linkType === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="enableSuggestions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Amount Suggestions</FormLabel>
                                <FormDescription>
                                  Show suggested amounts to customers
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-enable-suggestions"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <AnimatePresence>
                          {watchedValues.enableSuggestions && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3"
                            >
                              <Label>Suggested Amounts (USD)</Label>
                              <div className="flex flex-wrap gap-2">
                                {suggestionAmounts.map((amount) => (
                                  <Button
                                    key={amount}
                                    type="button"
                                    variant={watchedValues.suggestions?.includes(amount) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleSuggestion(amount)}
                                    data-testid={`button-suggestion-${amount}`}
                                  >
                                    ${amount}
                                  </Button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Link Metadata */}
                <Accordion type="single" collapsible className="border rounded-lg">
                  <AccordionItem value="Link-Metadata">
                    <AccordionTrigger className="px-4">Link Metadata</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Link Metadata</CardTitle>
                    <CardDescription>Basic information about your payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. XYZ Investment" 
                              {...field}
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description <span className="text-gray-400">(Optional)</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Give customers more details about what they're paying for"
                              className="min-h-[80px]"
                              {...field}
                              data-testid="textarea-description"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
  <Label>Image <span className="text-gray-400">(Optional)</span></Label>
  
  <label className="block">
    <input
      type="file"
      accept="image/png, image/jpeg, image/svg+xml"
      className="hidden"
      onChange={handleFileChange}
    />
    <div>
      {isImageUploaded ? (
        <img src={form.watch("image")} className="max-w-[500px] object-cover rounded-xl" alt="product cover " />
      ):(
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-1">Upload or drag your file here</p>
      <p className="text-xs text-gray-400">PNG, JPG, SVG up to 5MB</p>
    </div>
      )}
    </div>
  </label>
</div>

                  </CardContent>
                </Card>
                </AccordionContent>
</AccordionItem>
</Accordion>

                {/* Collect Customer Info */}
                 <Accordion type="single" collapsible className="border rounded-lg">
                  <AccordionItem value="Collect-Customer-Info">
                    <AccordionTrigger className="px-4">Collect Customer Info</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Collect Customer Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "collectName", label: "Name" },
                      { name: "collectEmail", label: "Email" },
                      { name: "collectPhone", label: "Phone number" },
                      { name: "collectBilling", label: "Billing details" },
                      { name: "collectShipping", label: "Shipping details" },
                      { name: "collectCustomFields", label: "Custom fields" },
                    ].map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name as keyof FormData}
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Switch
                                checked={formField.value as boolean}
                                onCheckedChange={formField.onChange}
                                data-testid={`switch-${field.name}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </CardContent>
                </Card>
                </AccordionContent>
                </AccordionItem>
                </Accordion>

                {/* Advanced Options */}
                <Accordion type="single" collapsible className="border rounded-lg">
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="px-4">Advanced Options</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                      
                      {/* Tags */}
                      <div className="space-y-3">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {tagOptions.map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant={watchedValues.tags?.includes(tag) ? "default" : "outline"}
                              size="sm"
                              onClick={() => console.log("tags")}
                              data-testid={`button-tag-${tag.toLowerCase()}`}
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Call to Action */}
                      <FormField
                        control={form.control}
                        name="btnText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Call to Action Label</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-call-to-action">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="donate">Donate</SelectItem>
                                <SelectItem value="pay">Pay</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      {/* Success Message */}
                      <FormField
                        control={form.control}
                        name="successMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Success Message</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Thank you for your payment!"
                                {...field}
                                data-testid="input-success-message"
                              />
                            </FormControl>
                            <FormDescription>
                              Custom message shown after successful payment
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  disabled={isSubmitting || !data.user.wallets }
                  data-testid="button-create-payment-link"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    "Create Payment Link"
                  )}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}