import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createPaymentLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  requireEmail: z.boolean().optional(),
});

interface CreatePaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePaymentLinkModal({ isOpen, onClose }: CreatePaymentLinkModalProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createPaymentLinkSchema>>({
    resolver: zodResolver(createPaymentLinkSchema),
    defaultValues: {
      title: "",
      amount: "",
      description: "",
      requireEmail: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/payment-links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      onClose();
      form.reset();
      toast({ title: "Payment link created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create payment link", variant: "destructive" });
    },
  });

  const onSubmit = (data: z.infer<typeof createPaymentLinkSchema>) => {
    createMutation.mutate({
      ...data,
      amount: parseFloat(data.amount),
      currency: "BTC",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-create-payment-link">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Invoice #001" 
                      {...field} 
                      data-testid="input-payment-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (BTC)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.00001" 
                      placeholder="0.00100" 
                      {...field} 
                      data-testid="input-payment-amount"
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      placeholder="Payment description..." 
                      {...field} 
                      data-testid="input-payment-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requireEmail"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-require-email"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Require customer email</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1"
                data-testid="button-cancel-payment-link"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending} 
                className="flex-1"
                data-testid="button-create-link"
              >
                {createMutation.isPending ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
