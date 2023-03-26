import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Invoice, Items } from "@prisma/client";
import { useAtom } from "jotai";
import { Fragment, useId } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button, DatePicker, SelectDropdown, TextInput } from "~/components/ui";
import {
  invoiceFormSchema,
  type InvoiceFormInput,
  type InvoiceInput,
} from "~/schemas/invoiceInfo";
import { modalAtom } from "~/store";
import { api } from "~/utils/api";
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
          className="relative z-10 "
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
            <div className="fixed inset-0 bg-black bg-opacity-50 " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="min-h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="mt-[72px] w-full transform bg-white shadow-xl transition-all sm:max-w-[616px] sm:rounded-r-[20px] lg:max-w-[719px]">
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
    // Editing the invoice
    if (isEdit && invoice?.id) {
      const updateInvoice: InvoiceInput = {
        id: invoice?.id,
        invoiceFormSchema,
      };
      editInvoice(updateInvoice);
    } else {
      // Creating a new inovice
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
      <div className="mx-auto mt-6 w-[90%] p-1 ">
        <button
          className="mt-4 flex items-center sm:hidden"
          onClick={() => setIsOpen(false)}
        >
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

        <h1 className="pt-6 text-[1.5rem] font-bold leading-[32px] tracking-[-0.5]">
          {isEdit ? (
            <>
              Edit <span className="text-gray">#</span>
              {invoice?.id}
            </>
          ) : (
            "New Invoice"
          )}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
          <div className="space-y-6">
            <h3 className="heading-s mt-4 mb-4 leading-[15px] text-purple sm:mt-8">
              Bill From
            </h3>

            <TextInput
              name="invoice.senderStreet"
              label="Street Address"
              register={register}
              errorMessage={errors.invoice?.senderStreet?.message}
            />
            <div className="sm:flex sm:gap-x-5">
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
                divClass="max-sm:mt-5 "
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
            <div className="sm:flex sm:gap-x-5">
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
                divClass="max-sm:mt-5"
              />
            </div>

            <div className="sm:flex sm:gap-x-5">
              <DatePicker
                name="invoice.paymentDue"
                label="Invoice Date"
                placeholder="21 Aug 2021"
                setValue={setValue}
                register={register}
                disabled={isEdit}
                errorMessage={errors.invoice?.paymentDue?.message}
                divClass="sm:w-full"
              />

              <SelectDropdown
                name="invoice.paymentTerms"
                label="Payment Terms"
                register={register}
                errorMessage={errors.invoice?.paymentTerms?.message}
                divClass="sm:w-full"
              />
            </div>
          </div>
          <TextInput
            name="invoice.description"
            label="Project Description"
            placeholder="e.g. Graphic Design Service"
            register={register}
            errorMessage={errors.invoice?.description?.message}
            divClass="max-sm:mt-6"
          />

          <h3 className="mt-14 mb-4 text-[1.125rem] font-bold tracking-[-0.38px] text-[#777F98] sm:mt-6">
            Item List
          </h3>

          {/* Mobile Only */}
          <div className="sm:hidden">
            {fields.map((field, index) => {
              return (
                <div key={index} className="mb-10">
                  <TextInput
                    name={`items.${index}.name`}
                    label="Item Name"
                    register={register}
                  />
                  <div className="mt-5 flex items-center gap-x-4">
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
          </div>

          {/* Desktop Only */}
          <div className="mb-5 max-sm:hidden">
            <div className="mb-3 flex w-full gap-x-4 text-[0.813rem] font-medium capitalize tracking-[-0.1px] text-light_blue">
              <span className="w-[214px]">Item Name</span>
              <span className="w-[46px]">Qty.</span>
              <span className="w-[100px]">Price</span>
              <span className="w-55px">Total</span>
            </div>
            {fields.map((field, index) => {
              return (
                <div key={index} className="mb-5 flex w-full gap-x-4">
                  <TextInput
                    name={`items.${index}.name`}
                    divClass="w-[214px]"
                    register={register}
                  />

                  <TextInput
                    type="number"
                    name={`items.${index}.quantity`}
                    register={register}
                    divClass="min-w-[46px]"
                    onBlur={() => getTotal(index)}
                  />

                  <TextInput
                    type="number"
                    name={`items.${index}.price`}
                    step="0.01"
                    divClass="w-[100px] items-center "
                    // className="text-center"
                    register={register}
                    onBlur={() => getTotal(index)}
                  />

                  <TextInput
                    type="number"
                    name={`items.${index}.total`}
                    disabled
                    divClass="w-[55px]"
                    register={register}
                  />

                  <button
                    className="shrink-0"
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
              );
            })}
          </div>
          <Button
            intent="secondary"
            fullWidth
            className="mb-10 sm:mb-6"
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

      <div className="heading-s bottom-0 flex w-full bg-white p-5 leading-[15px] sm:sticky sm:rounded-r-[20px] sm:p-7">
        {isEdit ? (
          <>
            <Button
              type="button"
              intent="secondary"
              onClick={() => setIsOpen(false)}
              className="mr-2 px-[1.63rem] sm:ml-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form={formId}
              isLoading={editInvoiceIsLoading}
              className="px-[1.40rem]"
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              intent="secondary"
              className="mr-2 px-[1.1rem] sm:px-6"
              onClick={() => setIsOpen(false)}
            >
              Discard
            </Button>
            <Button
              onClick={() => setValue("invoice.status", "draft")}
              type="submit"
              intent="dark"
              isLoading={addInvoiceIsLoading}
              form={formId}
              className="mr-2 px-[.9rem] sm:ml-auto sm:px-[1.37rem]"
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => setValue("invoice.status", "pending")}
              type="submit"
              isLoading={addInvoiceIsLoading}
              form={formId}
              className="px-[.9rem] sm:px-[1.37rem]"
            >
              Save & Send
            </Button>
          </>
        )}
      </div>
    </>
  );
};
