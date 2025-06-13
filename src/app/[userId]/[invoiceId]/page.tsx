import { Suspense } from "react";
import { Invoice } from "~/app/components/invoice";
import { Spinner } from "~/components/ui";
import { prisma } from "~/server/db";
import { notFound, redirect, unauthorized } from "next/navigation";
import { auth } from "~/auth";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ userId: string; invoiceId: string }>;
}) {
  const { userId, invoiceId } = await params;

  const session = await auth();

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user?.id !== invoice?.userId) {
    unauthorized();
  }

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      {invoice ? (
        <Suspense fallback={<Spinner />}>
          <Invoice invoice={invoice} />
        </Suspense>
      ) : (
        <p>Invoice not found</p>
      )}
    </main>
  );
}
