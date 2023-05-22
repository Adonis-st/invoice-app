export const formateDate = (newDate: string | Date) => {
  const formattedDate = newDate.toLocaleString("en-us", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${formattedDate}`;
};
