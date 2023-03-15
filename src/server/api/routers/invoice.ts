import { z } from "zod";
import {
  filterSchema,
  invoiceSchema,
  itemsSchema,
} from "~/schemas/invoiceInfo";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  getAllInvoices: protectedProcedure
    .input(filterSchema)
    .query(({ ctx, input }) => {
      const { draft, pending, paid } = input;
      return ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session?.user?.id,
          OR: [
            { status: draft ? "draft" : undefined },
            { status: pending ? "pending" : undefined },
            { status: paid ? "paid" : undefined },
          ],
        },
      });
    }),

  addInvoice: protectedProcedure
    .input(invoiceSchema)
    .mutation(({ ctx, input }) => {
      const { id, invoiceFormSchema } = input;
      const { invoice, items } = invoiceFormSchema;

      return ctx.prisma.invoice.create({
        data: {
          id,
          ...invoice,
          items: {
            createMany: {
              data: items,
            },
          },
          user: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
    }),

  getSingleInvoice: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: id }) => {
      return ctx.prisma.invoice.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });
    }),

  markAsPaid: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) => {
      return ctx.prisma.invoice.update({
        where: {
          id,
        },
        data: {
          status: "paid",
        },
      });
    }),

  editInvoice: protectedProcedure
    .input(invoiceSchema)
    .mutation(({ ctx, input }) => {
      const { id, invoiceFormSchema } = input;
      const { invoice, items } = invoiceFormSchema;

      return ctx.prisma.$transaction([
        ctx.prisma.items.deleteMany({ where: { invoiceId: id } }),
        ctx.prisma.invoice.update({
          where: { id },
          data: {
            ...invoice,
            items: {
              createMany: {
                data: items,
              },
            },
          },
        }),
      ]);
    }),

  deleteInvoice: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: id }) => {
      return ctx.prisma.invoice.delete({
        where: {
          id,
        },
      });
    }),

  getInvoiceIds: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.invoice.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      select: {
        id: true,
      },
    });
  }),

  addItems: protectedProcedure.input(itemsSchema).mutation(({ ctx, input }) => {
    const { items, invoiceId: id } = input;
    return ctx.prisma.items.create({
      data: {
        ...items,
        invoice: {
          connect: {
            id,
          },
        },
      },
    });
  }),
});
