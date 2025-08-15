// src/api/paymentSessions.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_EDNPOINT_URL } from "@/lib/constants";

interface CreatePaymentSessionPayload {
  paymentLinkId: string;
  amount?: number; // optional for fixed
  currency?: string; // optional for fixed
}

interface PaymentSession {
  id: string;
  paymentLinkId: string;
  businessId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  collectFields: Record<string, boolean>;
  successUrl?: string;
  cancelUrl?: string;
  products: any[];
  expiresAt: string;
  metadata: Record<string, any>;
}

interface CreatePaymentSessionResponse {
  message: string;
  paymentSession: PaymentSession;
}

export const useCreatePaymentSession = () => {
  return useMutation<CreatePaymentSessionResponse, Error, CreatePaymentSessionPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post<CreatePaymentSessionResponse>(
        `${SERVER_EDNPOINT_URL}payment-links/session`,
        payload
      );
      return data;
    },
  });
};
