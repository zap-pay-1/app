import { useMutation } from '@tanstack/react-query';
import { SERVER_EDNPOINT_URL } from '@/lib/constants';
interface UpsertBusinessRequest {
  clerkId: string;
  businessName: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  notificationEmail: string;
  supportEmail: string;
  website?: string;
  companyIdNumber?: string;
  taxId?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
}

interface BusinessResponse {
  id: string;
  name: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  notificationEmail: string;
  supportEmail: string;
  website?: string;
  companyIdNumber?: string;
  taxId?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const useUpsertBusiness = () => {
  return useMutation<BusinessResponse, Error, UpsertBusinessRequest>({
    mutationFn: async (businessData) => {
      const res = await fetch(`${SERVER_EDNPOINT_URL}business/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });
      if (!res.ok) throw new Error('Failed to upsert business');
      return res.json() as Promise<BusinessResponse>;
    },
  });
};
