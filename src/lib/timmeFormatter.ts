   export function formatDate(dateString : Date) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short", // 'long' -> August, 'short' -> Aug
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format
  }).format(date);
   }