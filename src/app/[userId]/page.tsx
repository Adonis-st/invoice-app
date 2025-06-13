import { Suspense } from "react";
import { InvoiceList } from "~/app/components/invoice-list";
import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { prisma } from "~/server/db";
import { Spinner } from "~/components/ui";

export default async function InvoiceListPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  // const session = await auth();

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      //   OR: [
      //     { status: draft ? "draft" : undefined },
      //     { status: pending ? "pending" : undefined },
      //     { status: paid ? "paid" : undefined },
      //   ],
    },
  });

  // if (!session) {
  //   redirect(`/sign-in`);
  // }

  return (
    <Suspense fallback={<Spinner />}>
      <InvoiceList invoices={invoices} />
    </Suspense>
  );
}
