import { modalAtom } from "~/store";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { Fragment } from "react";
import { Button, DatePicker, TextInput, SelectDropdown } from "~/components/ui";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type InvoiceFormInput,
  invoiceFormSchema,
  type InvoiceInput,
} from "~/schemas/invoiceInfo";
import { useId } from "react";
import { api } from "~/utils/api";
import type { Invoice, Items } from "@prisma/client";
import { createId, uniqueId } from "~/utils/generateId";

interface ModalProps {
  isEdit?: boolean;
  invoice?:
    | Invoice & {
        items: Items[];
      };
}
export const InvoiceModal = ({ invoice, isEdit = false }: ModalProps) => {
  const [isOpen, setIsOpen] = useAtom(modalAtom);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center sm:pr-64">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform bg-white p-1  shadow-xl transition-all ">
                  <InvoiceForm {...{ isEdit, invoice }} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

/* eslint-disable @typescript-eslint/no-misused-promises */

interface FormProps {
  isEdit: boolean;
  invoice?:
    | Invoice & {
        items?: Items[];
      };
}

export const InvoiceForm = ({ isEdit, invoice }: FormProps) => {
  const formId = useId();
  const [, setIsOpen] = useAtom(modalAtom);

  const invoicesIds = api.invoice.getInvoiceIds.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const utils = api.useContext();

  const { mutate: addInvoice, isLoading: addInvoiceIsLoading } =
    api.invoice.addInvoice.useMutation({
      onSuccess: () => {
        void utils.invoice.getAllInvoices.invalidate();
        setIsOpen(false);
      },
    });

  const { mutate: editInvoice, isLoading: editInvoiceIsLoading } =
    api.invoice.editInvoice.useMutation({
      onSuccess: () => {
        void utils.invoice.getSingleInvoice.invalidate();
        setIsOpen(false);
      },
    });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    getValues,
    formState: { errors },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    mode: "onBlur",
    defaultValues: isEdit ? { invoice, items: invoice?.items } : {},
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const addItem = () => {
    append({ name: " ", quantity: 0, price: 0.0, total: 0.0 });
  };

  const getTotal = (index: number) => {
    setValue(
      `items.${index}.quantity`,
      parseInt(getValues(`items.${index}.quantity`).toString())
    );
    setValue(
      `items.${index}.price`,
      parseFloat(getValues(`items.${index}.price`).toString())
    );

    setValue(
      `items.${index}.total`,
      +(
        getValues(`items.${index}.quantity`) * getValues(`items.${index}.price`)
      ).toFixed(2)
    );

    const itemsWatch = watch("items");
    const total = itemsWatch.reduce(
      (acc, current) => acc + (current.price || 0) * (current.quantity || 0),
      0
    );

    setValue("invoice.total", total);
  };

  const onSubmit = (invoiceFormSchema: InvoiceFormInput) => {
    if (isEdit && invoice?.id) {
      const updateInvoice: InvoiceInput = {
        id: invoice?.id,
        invoiceFormSchema,
      };
      editInvoice(updateInvoice);
    } else {
      let id = createId();
      const ids = invoicesIds?.data?.map((inv) => inv.id);
      if (ids) {
        while (!uniqueId({ id, ids })) {
          id = createId();
        }
      }
      const newInvoice: InvoiceInput = { id, invoiceFormSchema };
      addInvoice(newInvoice);
    }
  };
  return (
    <>
      <div className="mx-auto mt-24 w-[90%]">
        <button className="flex items-center" onClick={() => setIsOpen(false)}>
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
        </button>

        <h1 className="mt-6 text-[1.5rem] font-bold leading-[32px] tracking-[-0.5]">
          New Invoice
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
          <div className="space-y-6">
            <h3 className="heading-s mt-4 mb-4 leading-[15px] text-purple">
              Bill From
            </h3>

            <TextInput
              name="invoice.senderStreet"
              label="Street Address"
              register={register}
              errorMessage={errors.invoice?.senderStreet?.message}
            />
            <div className="sm:flex ">
              <div className="flex gap-x-5">
                <TextInput
                  name="invoice.senderCity"
                  label="City"
                  register={register}
                  errorMessage={errors.invoice?.senderCity?.message}
                />

                <TextInput
                  name="invoice.senderZipCode"
                  label="Zip Code"
                  register={register}
                  errorMessage={errors.invoice?.senderZipCode?.message}
                />
              </div>

              <TextInput
                name="invoice.senderCountry"
                label="Country"
                register={register}
                errorMessage={errors.invoice?.senderCountry?.message}
                className="sm:w-1/2"
                divClass="mt-5"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="heading-s mt-10 mb-4 leading-[15px] text-purple">
              Bill To
            </h3>

            <TextInput
              name="invoice.clientName"
              label="Client's Name"
              register={register}
              errorMessage={errors.invoice?.clientName?.message}
            />

            <TextInput
              name="invoice.clientEmail"
              label="Client's Email"
              placeholder="e.g. email@example.com"
              register={register}
              errorMessage={errors.invoice?.clientEmail?.message}
            />

            <TextInput
              name="invoice.clientStreet"
              label="Street Address"
              register={register}
              errorMessage={errors.invoice?.clientStreet?.message}
            />
            <div className="sm:flex">
              <div className="flex gap-x-5">
                <TextInput
                  name="invoice.clientCity"
                  label="City"
                  register={register}
                  errorMessage={errors.invoice?.clientCity?.message}
                />

                <TextInput
                  name="invoice.clientZipCode"
                  label="Zip Code"
                  register={register}
                  errorMessage={errors.invoice?.clientZipCode?.message}
                />
              </div>
              <TextInput
                name="invoice.clientCountry"
                label="Country"
                register={register}
                errorMessage={errors.invoice?.clientCountry?.message}
                divClass="mt-5"
              />
            </div>

            <DatePicker
              name="invoice.paymentDue"
              label="Invoice Date"
              placeholder="21 Aug 2021"
              setValue={setValue}
              register={register}
              errorMessage={errors.invoice?.paymentDue?.message}
            />

            <SelectDropdown
              name="invoice.paymentTerms"
              label="Payment Terms"
              register={register}
              errorMessage={errors.invoice?.paymentTerms?.message}
            />

            <TextInput
              name="invoice.description"
              label="Project Description"
              placeholder="e.g. Graphic Design Service"
              register={register}
              errorMessage={errors.invoice?.description?.message}
            />
          </div>
          <h3 className="mt-14 mb-4 text-[1.125rem] font-bold tracking-[-0.38px] text-[#777F98]">
            Item List
          </h3>

          {fields.map((field, index) => {
            return (
              <div key={index}>
                <TextInput
                  name={`items.${index}.name`}
                  label="Item Name"
                  register={register}
                />
                <div className="mt-5 mb-10 flex items-center gap-x-4">
                  <TextInput
                    type="number"
                    name={`items.${index}.quantity`}
                    label="Qty."
                    register={register}
                    className="w-16"
                    onBlur={() => getTotal(index)}
                  />

                  <TextInput
                    type="number"
                    name={`items.${index}.price`}
                    step="0.01"
                    label="Item Price"
                    register={register}
                    onBlur={() => getTotal(index)}
                    className="w-[100px]"
                  />

                  <TextInput
                    type="number"
                    name={`items.${index}.total`}
                    label="Total"
                    disabled
                    register={register}
                  />

                  <button
                    className="mt-3 mr-1 shrink-0"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <svg
                      width="13"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                        fill="#888EB0"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          <Button
            intent="secondary"
            fullWidth
            className="mb-10"
            type="button"
            onClick={() => addItem()}
          >
            + Add New Item
          </Button>

          <input
            type="text"
            className="hidden "
            {...register("invoice.total", {
              valueAsNumber: true,
              value: 0,
            })}
          />
        </form>
      </div>

      <div className="heading-s flex w-full bg-white p-5 leading-[15px]">
        {isEdit ? (
          <>
            <Button
              type="button"
              intent="secondary"
              size="xs"
              onClick={() => setIsOpen(false)}
              className="mr-2 px-[1.1rem] "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form={formId}
              isLoading={editInvoiceIsLoading}
              className="px-[.9rem]"
              size="sm"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              intent="secondary"
              size="xs"
              className="mr-2 px-[1.1rem] "
            >
              Discard
            </Button>
            <Button
              onClick={() => setValue("invoice.status", "draft")}
              type="submit"
              size="sm"
              intent="dark"
              isLoading={addInvoiceIsLoading}
              form={formId}
              className="mr-2 px-[.9rem] "
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => setValue("invoice.status", "pending")}
              type="submit"
              isLoading={addInvoiceIsLoading}
              form={formId}
              className="px-[.9rem]"
              size="sm"
            >
              Save & Send
            </Button>
          </>
        )}
      </div>
    </>
  );
};
