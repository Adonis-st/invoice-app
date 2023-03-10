import { z } from "zod";

export const requiredMessage = "Can't be empty";

export const hasId = z.string();

export const items = z.object({
  name: z.string().min(1, requiredMessage),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
});

export const invoice = z.object({
  paymentDue: z.date(),
  description: z.string().min(1, requiredMessage),
  paymentTerms: z.number().min(1, requiredMessage),
  clientName: z.string().min(1, requiredMessage),
  clientEmail: z.string().min(1, requiredMessage),
  clientStreet: z.string().min(1, requiredMessage),
  clientCity: z.string().min(1, requiredMessage),
  clientZipCode: z.string().min(1, requiredMessage),
  clientCountry: z.string().min(1, requiredMessage),
  status: z.string().min(1, requiredMessage),
  senderStreet: z.string().min(1, requiredMessage),
  senderCity: z.string().min(1, requiredMessage),
  senderZipCode: z.string().min(1, requiredMessage),
  senderCountry: z.string().min(1, requiredMessage),
  total: z.number(),
});
