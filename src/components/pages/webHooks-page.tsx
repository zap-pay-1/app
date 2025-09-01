"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Webhook, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useAuth } from "@clerk/clerk-react";
import { USER_DATA, WEB_HOOKS_DATA } from "@/types/types";
import { StickyInfoBanner } from "../stick-info-banner";
const createWebhookSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  events: z.array(z.string()).min(1, "Select at least one event"),
});


type EventsTypes = {
  id : string
  label : string
  description : string
}
const availableEvents = [
  { id: "payment.created", label: "Payment Created", description: "When a new payment is initiated" },
  { id: "payment.confirmed", label: "Payment Confirmed", description: "When a payment is confirmed on-chain" },
  { id: "payment.failed", label: "Payment Failed", description: "When a payment fails or expires" },
  { id: "paymentlink.created", label: "Payment Link Created", description: "When a new payment link is created" },
  { id: "paymentlink.expired", label: "Payment Link Expired", description: "When a payment link expires" },
];

type Props = {
  data : USER_DATA
}
export default function Webhooks({data}: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
   const {userId} = useAuth()

   const fetchWebooks = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}webhooks/${userId}`)
    return res.data
   }
  const { data: webhooks , isLoading, isPending } = useQuery<WEB_HOOKS_DATA>({
    queryKey: ["/api/webhooks"],
    queryFn : fetchWebooks,
      enabled : !!userId
  });

  const form = useForm<z.infer<typeof createWebhookSchema>>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues: {
      url: "",
      events: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { url: string; events: string[] }) => 
      apiRequest("POST", `${SERVER_EDNPOINT_URL}webhooks`, {...data, clerkId : userId}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setIsCreateModalOpen(false);
      form.reset();
      toast({ title: "Webhook created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create webhook", variant: "destructive" });
    },
  });


  const onSubmit = (data: z.infer<typeof createWebhookSchema>) => {
   createMutation.mutate(data);
  };

  if (isLoading|| isPending) {
    return <div data-testid="loading-state" className="w-full flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
       {!data.user.wallets &&
                  <StickyInfoBanner
                   message="You haven't completed your business setup yet 🚀. Add your business info and connect your payment method to start accepting BTC payments today." 
                   />
                  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-sm text-gray-500 mt-1">Receive real-time notifications about payment events</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          data-testid="button-create-webhook"
          disabled={!data.user.wallets}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Documentation Card */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center">
            <Webhook className="w-5 h-5 mr-2" />
            Webhook Events
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-800">
          <p className="text-sm mb-4">
            Webhooks are HTTP callbacks sent to your server when specific events occur. Each webhook includes a signature for verification.
          </p>
          <div className="bg-green-100 p-3 rounded-lg font-mono text-sm mb-4">
            POST /your-webhook-endpoint
            <br />
            X-Signature: sha256=abc123...
            <br />
            Content-Type: application/json
          </div>
          <div className="space-x-4">
            <Button variant="outline" size="sm" className="text-green-700 border-green-300">
              View Documentation
            </Button>
            <Button variant="outline" size="sm" className="text-green-700 border-green-300 hidden">
              Test Webhooks
            </Button>
          </div>
        </CardContent>
      </Card>

      { !webhooks?.webhooks ||
       webhooks?.webhooks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Webhook className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
              <p className="text-gray-500 text-sm mb-6">Set up webhooks to receive real-time notifications about payment events.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                data-testid="button-create-first-webhook"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Configured Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks?.webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Webhook className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 font-mono text-sm">{webhook.url}</span>
                        <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                          {webhook.status ===  "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Events: {webhook.events.join(", ")}
                      </div>
                      <div className="text-xs text-gray-400">
                        Created {new Date(webhook.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`button-configure-${webhook.id}`}
                      disabled={true}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => console.log("Coming soon..")}
                      disabled={true}
                      data-testid={`button-delete-${webhook.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md" data-testid="modal-create-webhook">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Webhook URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://your-app.com/webhooks" 
                        {...field} 
                        data-testid="input-webhook-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="events"
                render={() => (
                  <FormItem>
                    <FormLabel>Events to Subscribe</FormLabel>
                    <div className="space-y-3">
                      {availableEvents.map((event) => (
                        <FormField
                          key={event.id}
                          control={form.control}
                          name="events"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={event.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(event.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, event.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== event.id
                                            )
                                          )
                                    }}
                                    data-testid={`checkbox-event-${event.id}`}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium">
                                    {event.label}
                                  </FormLabel>
                                  <p className="text-xs text-gray-500">
                                    {event.description}
                                  </p>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="flex-1"
                  data-testid="button-cancel-webhook"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending} 
                  className="flex-1"
                  data-testid="button-submit-webhook"
                >
                  {createMutation.isPending ? "Creating..." : "Add Webhook"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
