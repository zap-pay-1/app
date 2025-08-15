import z from "zod";

export const formSchema = z.object({
  linkType: z.enum(["fixed", "custom"]),
  amount: z.coerce.number().optional().default(0),
  currency: z.string().default("USDC"),
  enableSuggestions: z.boolean().default(false),
  suggestions: z.array(z.string()).default([]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  collectName: z.boolean().default(false),
  collectEmail: z.boolean().default(false),
  collectPhone: z.boolean().default(false),
  collectBilling: z.boolean().default(false),
  collectShipping: z.boolean().default(false),
  collectCustomFields: z.boolean().default(false),
  tags: z.string(),
  clerkId : z.string().optional(),
  btnText: z.enum(["book", "donate", "pay"]).default("pay"),
  successMessage: z.string().optional(),
  acceptPaymentOn: z.array(z.string()).default(["ethereum", "polygon"]),
});