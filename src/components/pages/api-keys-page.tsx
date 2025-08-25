"use client"

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Key, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useAuth } from "@clerk/clerk-react";
import { API_KEY, API_KEYS_DATA } from "@/types/types";
import { truncateMiddle } from "@/lib/utils";
const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function ApiKeys() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);
  const { toast } = useToast();
  const {userId} = useAuth()
  
   const fetchApiKeys = async () => {
    const res = await axios.get(`${SERVER_EDNPOINT_URL}api-keys/${userId}`)
    return res.data
   }
  const { data: apiKeys , isLoading } = useQuery<API_KEYS_DATA>({
    queryKey: ["/api/keys"],
    queryFn : fetchApiKeys,
    enabled : !!userId
  });

  const form = useForm<z.infer<typeof createApiKeySchema>>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
    },
  });

    const createKey = async () => {
       const res = await axios.post(`${SERVER_EDNPOINT_URL}api-keys`, {
        label : form.watch("name"),
         clerkId : userId
       })
      return res
    }
  const createMutation = useMutation({
    mutationFn:  createKey,  //(data: { lable: string, clerkId : string }) => apiRequest("POST", `${SERVER_EDNPOINT_URL}api-keys`, data),
    onSuccess: async (response) => {
      console.log("Rsponse obje", response)
      const result = await response.data   //.json();
      console.log("Result", result)
      setNewApiKey(result.apiKey);
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      form.reset();
      toast({ title: "API key created successfully" });
    },
    onError: (error) => {
      console.log(error)
      toast({ title: "Failed to create API key", variant: "destructive" });
    },
  });


  const onSubmit = (data: z.infer<typeof createApiKeySchema>) => {
    createMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewApiKey(null);
  };

  if (isLoading) {
    return <div data-testid="loading-state">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your API keys for programmatic access</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          data-testid="button-create-api-key"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Documentation Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="text-sm mb-4">
            Use your API keys to integrate sBTC payments into your application. Include your API key in the Authorization header:
          </p>
          <div className="bg-blue-100 p-3 rounded-lg font-mono text-sm">
            Authorization: Bearer your-api-key-here
          </div>
          <div className="mt-4 space-x-4">
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
              View Documentation
            </Button>
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
              Code Examples
            </Button>
          </div>
        </CardContent>
      </Card>

      {apiKeys?.apiKeys.length === 0 || !apiKeys?.apiKeys ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
              <p className="text-gray-500 text-sm mb-6">Create your first API key to start integrating payments programmatically.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                data-testid="button-create-first-api-key"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys?.apiKeys.map((key : API_KEY) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Key className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{key.label}</span>
                        <Badge variant={key.status === "active" ? "default" : "secondary"}>
                          {key.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {showKey === key.id ? key.keyHash : `${key.key}***`}
                      </div>
                      <div className="text-xs text-gray-400">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                        { `• Last used ${new Date(new Date()).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      data-testid={`button-toggle-visibility-${key.id}`}
                    >
                      {showKey === key.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(key.key)}
                      data-testid={`button-copy-${key.id}`}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => console.log("Delete")}
                      disabled={true}
                      data-testid={`button-delete-${key.id}`}
                    
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

      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent data-testid="modal-create-api-key">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          
          {newApiKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">API Key Created Successfully!</h4>
                <p className="text-sm text-green-700 mb-3">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
                <div className="bg-white p-3 rounded border font-mono text-sm break-all">
                  {newApiKey}
                </div>
                <Button 
                  className="mt-3 w-full" 
                  onClick={() => copyToClipboard(newApiKey)}
                  data-testid="button-copy-new-api-key"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy API Key
                </Button>
              </div>
              <Button 
                onClick={handleCloseCreateModal} 
                className="w-full"
                data-testid="button-close-api-key-modal"
              >
                Done
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Production API, Development Key" 
                          {...field} 
                          data-testid="input-api-key-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseCreateModal} 
                    className="flex-1"
                    data-testid="button-cancel-api-key"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending} 
                    className="flex-1"
                    data-testid="button-submit-api-key"
                  >
                    {createMutation.isPending ? "Creating..." : "Create API Key"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
