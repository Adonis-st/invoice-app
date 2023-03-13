import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Error from "next/error";
import Head from "next/head";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";
import { InvoiceModal } from "~/components/InvoiceModal";
import { Button, Spinner } from "~/components/ui";

import { modalAtom } from "~/store";
import { api } from "~/utils/api";
import { formateDate } from "~/utils/formateDate";
import { InvoiceStatus } from "~/utils/Status";
import { Dialog, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";

export default function InvoicePage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const invoiceId = router.query.invoiceId as string;
  const [isOpen, setIsopen] = useAtom(modalAtom);

  const {
    data: invoice,
    isLoading,
    refetch,
  } = api.invoice.getSingleInvoice.useQuery(invoiceId, {
    refetchOnWindowFocus: false,
  });

  const { mutate: markAsPaid } = api.invoice.markAsPaid.useMutation();

  const [isDeleting, setIsDeleting] = useState(false);

  if (!sessionData) return null;

  if (isLoading) return <Spinner />;

  if (!invoice) return <Error statusCode={404} />;

  return (
    <>
      <Head>
        <title>{invoice.clientName}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto mt-7 w-[87%]">
        {isOpen && <InvoiceModal invoice={invoice} isEdit={true} />}
        {isDeleting && (
          <DeleteModal {...{ invoiceId, setIsDeleting, router, refetch }} />
        )}
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
        <Button intent="danger" size="sm" onClick={() => setIsDeleting(true)}>
          Delete
        </Button>
        <Button onClick={() => markAsPaid(invoiceId)}>Mark as Paid</Button>
      </div>
    </>
  );
}

interface DeleteModalProps {
  invoiceId: string;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  router: NextRouter;
}

export const DeleteModal = ({
  invoiceId,
  setIsDeleting,
  router,
}: DeleteModalProps) => {
  const closeModal = () => setIsDeleting(false);
  const utils = api.useContext();

  const { mutate, isLoading } = api.invoice.deleteInvoice.useMutation({
    onSuccess: () => {
      void utils.invoice.getAllInvoices.invalidate();
      void router.push("/");
    },
  });

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[327px] transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="heading-m tracking-[-0.5px] text-coal"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="body leading-[22px] text-gray">
                      Are you sure you want to delete invoice #{invoiceId}? This
                      action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end ">
                    <Button
                      type="button"
                      intent="secondary"
                      size="sm"
                      className="heading-s mr-3"
                      onClick={() => setIsDeleting(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      isLoading={isLoading}
                      intent="danger"
                      className="heading-s "
                      onClick={() => mutate(invoiceId)}
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
