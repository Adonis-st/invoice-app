import { z } from "zod";
import { invoiceSchema, itemsSchema } from "~/schemas/invoiceInfo";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  //   getAll: publicProcedure.query(({ ctx }) => {
  //     return ctx.prisma.example.findMany();
  //   }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

  getAllInvoices: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.invoice.findMany({
      where: {
        userId: ctx.session?.user?.id,
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

      //  ctx.prisma.invoice.upsert({
      //   where: {
      //     id,
      //   },
      //   update: { ...invoice, ...items },
      //  include: {
      //   items: {
      //     create: {
      //       ...items,
      //     },
      //   },
      //  },
      // });

      // return ctx.prisma.items.upsert({
      //   where: {
      //     id: items.id,
      //   },
      // });
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
