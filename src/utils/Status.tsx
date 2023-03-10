export const InvoiceStatus = (invoiceStatus: string) => {
  let color: string;
  if (invoiceStatus === "draft") {
    color = "#373B53";
  } else if (invoiceStatus === "pending") {
    color = "#FF8F00";
  } else {
    color = "#33D69F";
  }
  return (
    <div
      className="flex h-[40px] w-[104px] items-center justify-center rounded-md bg-[#33D69F]/20 capitalize "
      style={{ color, backgroundColor: color + "0f" }}
    >
      <div
        className="mr-2 aspect-square w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="heading-s">{invoiceStatus}</span>
    </div>
  );
};
