export const formateDate = (newDate: string | Date) => {
  // TODO fix date when fetching from server
  const date = new Date(newDate);
  const formattedDate = new Date(
    date.setDate(date.getDate() + 1)
  ).toLocaleDateString("en-us", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${formattedDate}`;
};
