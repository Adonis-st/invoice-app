import { format, addDays } from "date-fns";

const aWeekFromNow = () => {
  return format(addDays(new Date(Date.now()), 7), "yyyy-MM-dd");
};

export const emptyInvoice = {
  clientAddress: {
    city: "",
    country: "",
    postCode: "",
    street: "",
  },
  clientEmail: "",
  clientName: "",
  createdAt: format(Date.now(), "yyyy-MM-dd"),
  description: "",
  items: [],
  paymentDue: aWeekFromNow(),
  paymentTerms: 7,
  senderAddress: {
    city: "",
    country: "",
    postCode: "",
    street: "",
  },
  status: "draft",
  total: 0,
};
