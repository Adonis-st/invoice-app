import { z } from "zod";
import { invoice, items, hasId } from "./base";

export const invoiceFormSchema = z.object({
  invoice,
  items: z.array(items),
});
export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;

export const invoiceSchema = z.object({
  id: hasId,
  invoiceFormSchema,
});
export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const itemsSchema = z.object({
  invoiceId: hasId,
  items,
});
