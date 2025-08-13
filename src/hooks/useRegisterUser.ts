import { SERVER_EDNPOINT_URL } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';

interface RegisterUserRequest {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface RegisterUserResponse {
  id: string;
  clerkId: string;
  email: string;
  first_name?: string;
  last_name?: string;
  createdAt: string;
  updatedAt: string;
}

export const useRegisterUser = () => {
  return useMutation<RegisterUserResponse, Error, RegisterUserRequest>({
    mutationFn: async ({ clerkId, email, firstName, lastName }) => {
      const res = await fetch(`${SERVER_EDNPOINT_URL}users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId,
          email,
          
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to register user');
      }

      return res.json() as Promise<RegisterUserResponse>;
    },
  });
};
