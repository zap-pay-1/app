// src/api/paymentLinks.ts
import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { formSchema } from "@/lib/formSchema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

type FormValues = z.infer<typeof formSchema>;

const mapFormDataToPayload = (data: FormValues) => {
  // Step 1: Build collectFields JSON
  const collectFields: Record<string, boolean> = {
    name: data.collectName,
    email: data.collectEmail,
    phone: data.collectPhone,
    billing: data.collectBilling,
    shipping: data.collectShipping,
    customFields: data.collectCustomFields,
  };

  // Step 2: Build products array (currently single product)
  const products = [
    {
      title: data.title,
      description: data.description,
      image: data.image,
    },
  ];

  // Step 3: Return payload for backend
  return {
    linkType: data.linkType,
    amount: data.amount || null,
    currency: data.currency,
    enableSuggestions: data.enableSuggestions,
    suggestions: data.suggestions,
    collectFields, // JSON
    products, // JSON array
    tags: data.tags,
    btnText: data.btnText,
    successMsg: data.successMessage,
    acceptPaymentOn: data.acceptPaymentOn,
    title : data.title,
     clerkId: data.clerkId, 
  };
};

// Mutation Hook
export const useCreatePaymentLink = () => {
  return useMutation({
    mutationFn: async (formData: FormValues) => {
      const payload = mapFormDataToPayload(formData);
      const { data } = await axios.post(`${SERVER_EDNPOINT_URL}payment-links/create`, payload);
      return data;
    },
  });
};
