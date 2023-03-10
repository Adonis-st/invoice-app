import { Filter } from "~/features/invoice/Filter";
import { invoiceAtom, modalAtom } from "~/store";
import { formateDate } from "~/utils/formateDate";
import { InvoiceStatus } from "~/utils/Status";
import { useAtom } from "jotai";
import Link from "next/link";
import { Modal } from "./Modal";
import { InvoiceForm } from "./InvoiceForm";
import { Button } from "./ui";
import { api } from "~/utils/api";

export const Invoices = () => {
  const [invoices] = useAtom(invoiceAtom);
  const { data } = api.invoice.getAllInvoices.useQuery();
  const [isOpen, setIsopen] = useAtom(modalAtom);
  return (
    <div className="mx-auto mt-8 w-[90%]">
      {/* <InvoiceForm /> */}
      {/* {isOpen && <Modal InvoiceForm={InvoiceForm} />} */}

      <div className="flex justify-between">
        <div>
          <h1 className="heading-m">Invoices</h1>
          <span className="body leading-[15px] text-gray">
            {invoices.length ? `${invoices.length} invoices` : "No Invoices"}
          </span>
        </div>
        <div className="flex items-center">
          <Filter />

          <Button
            size="xs"
            className="body pr-2"
            onClick={() => setIsopen(true)}
          >
            <div className="mr-2 rounded-full bg-white p-2">
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
                  fill="#7C5DFA"
                  fillRule="nonzero"
                />
              </svg>
            </div>
            New
          </Button>
        </div>
      </div>
      {invoices.length ? (
        <div className="mt-10 mb-[200rem]">
          {/* {invoices.map((invoice) => {
            return (
              <Link
                href={`/invoice/${invoice.id}`}
                key={invoice.id}
                className="mb-4 block rounded-lg bg-white p-6"
              >
                <div className="flex justify-between">
                  <span>
                    # <span>{invoice.id}</span>
                  </span>

                  <span className="body text-[#858BB2]">
                    {invoice.clientName}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <div className="flex flex-col">
                    <span className="body text-light_blue">
                      {"Due " + formateDate(invoice.paymentDue)}
                    </span>
                    <span className="heading-s mt-2 text-coal">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                  {InvoiceStatus(invoice.status)}
                </div>
              </Link>
            );
          })} */}
          {data?.map((invoice) => {
            return (
              <Link
                href={`/invoice/${invoice.id}`}
                key={invoice.id}
                className="mb-4 block rounded-lg bg-white p-6"
              >
                <div className="flex justify-between">
                  <span>
                    # <span>{invoice.id}</span>
                  </span>

                  <span className="body text-[#858BB2]">
                    {invoice.clientName}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <div className="flex flex-col">
                    <span className="body text-light_blue">
                      {"Due " + formateDate(invoice.paymentDue)}
                    </span>
                    <span className="heading-s mt-2 text-coal">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                  {InvoiceStatus(invoice.status)}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center">
          <img src="/assets/illustration-empty.svg" alt="illustration-empty" />
          <h3 className="heading-m mt-10 text-coal">There is nothing here</h3>
          <p className="body mt-5 w-[176px] text-center text-gray">
            Create an invoice by clicking the{" "}
            <span className="font-bold">New</span> button and get started
          </p>
        </div>
      )}
    </div>
  );
};
