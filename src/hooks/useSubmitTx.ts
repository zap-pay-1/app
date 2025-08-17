import { SERVER_EDNPOINT_URL } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";

type SubmitTxPayload = {
  txid: string;
  collectedData?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    // ...add more based on your collectInfo blueprint
  };
};

export function useSubmitTx(sessionId: string) {
  return useMutation({
    mutationFn: async (payload: SubmitTxPayload) => {
      const res = await fetch(`${SERVER_EDNPOINT_URL}sessions/${sessionId}/submit-tx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit tx");
      }

      return res.json();
    },
  });
}
