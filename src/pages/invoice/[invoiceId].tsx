import { InvoiceStatus } from "~/utils/Status";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { modalAtom } from "~/store";
import { formateDate } from "~/utils/formateDate";
import { Button } from "~/components/ui";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Spinner } from "~/components/ui/Spinner";
import { Modal } from "~/components/Modal";
import { InvoiceForm } from "~/components/InvoiceForm";

export default function InvoicePage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const invoiceId = router.query.invoiceId as string;
  const [isOpen, setIsopen] = useAtom(modalAtom);

  const { data: invoice, isLoading } =
    api.invoice.getSingleInvoice.useQuery(invoiceId);

  const { mutate: markAsPaid } = api.invoice.markAsPaid.useMutation();

  // const {mutate:editInvoice}

  // const [invoices] = useAtom(invoiceAtom);

  // const invoice = invoices.find((item) => item.id === invoiceId);

  if (!sessionData) return null;

  if (isLoading) return <Spinner />;

  if (!invoice) return null;

  return (
    <>
      <main className="mx-auto mt-7 w-[87%]">
        <InvoiceForm formData={invoice} isEdit={true} />
        {/* {isOpen && <Modal InvoiceForm={InvoiceForm} />} */}
        <Link href={"/"} className="flex items-center">
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.342.886L2.114 5.114l4.228 4.228"
              stroke="#9277FF"
              strokeWidth="2"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
          <span className="heading-s ml-4 leading-[15px] text-coal">
            Go Back
          </span>
        </Link>

        <div className="mt-7 flex items-center justify-between rounded-lg bg-white p-6">
          <span>Status</span>
          {InvoiceStatus(invoice.status)}
        </div>

        <div className="body mt-5 rounded-lg bg-white p-5 leading-[15px] text-light_blue">
          <div className="flex flex-col">
            <span>
              #{" "}
              <span className="heading-s leading-[20px] text-coal">
                {invoice.id}
              </span>
            </span>
            <span className="mt-2">{invoice.description}</span>

            <span className="mt-6">{invoice.senderStreet}</span>
            <span className="mt-1">{invoice.senderCity}</span>
            <span className="mt-1">{invoice.senderZipCode}</span>
            <span className="mt-1">{invoice.senderCountry}</span>
          </div>

          <div className="mt-6 flex ">
            <div className="flex flex-col">
              <span>Invoice Date</span>
              <span className="heading-s mt-3 leading-[20px] text-coal">
                {formateDate(invoice.createdAt)}
              </span>
              <span className="mt-7">Payment Due</span>
              <span className="heading-s mt-3 leading-[20px] text-coal">
                {formateDate(invoice.paymentDue)}
              </span>
            </div>
            <div className="ml-20 flex flex-col">
              <span>Bill To</span>
              <span className="heading-s mt-3 leading-[20px] text-coal">
                {invoice.clientName}
              </span>
              <span className="mt-2">{invoice.clientStreet}</span>
              <span className="mt-1">{invoice.clientCity}</span>
              <span className="mt-1">{invoice.clientZipCode}</span>
              <span className="mt-1">{invoice.clientCountry}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col">
            <span className="">Sent to</span>
            <span className="heading-s mt-3 leading-[20px] text-coal">
              {invoice.clientEmail}
            </span>
          </div>

          <div className="mx-auto mt-7 flex w-[98%] flex-col">
            <div className="rounded-t-lg bg-[#F9FAFE] p-6">
              <div className="">
                {invoice?.items?.map((item, index) => {
                  return (
                    <div
                      className="mb-5 flex items-center justify-between last:mb-0"
                      key={index}
                    >
                      <div className="flex flex-col">
                        <span className="heading-s leading-[20px] text-coal">
                          {item.name}
                        </span>
                        <span className="heading-s mt-1 leading-[15px]">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="heading-s leading-[20px] text-coal ">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-b-lg bg-[#373B53] p-6">
              <span className="body text-white">Grand Total</span>
              {/* 
                  //TODO: Make a func to cal totoal
                    */}
              <span className="text-[1.5rem] font-bold leading-[32px] tracking-[-0.5px]  text-white">
                ${invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="heading-s mt-10 flex justify-evenly bg-white p-6 leading-[15px]">
        <Button intent="secondary" size="sm" onClick={() => setIsopen(true)}>
          Edit
        </Button>
        <Button intent="danger" size="sm">
          Delete
        </Button>
        <Button onClick={() => markAsPaid(invoiceId)}>Mark as Paid</Button>
      </div>
    </>
  );
}
