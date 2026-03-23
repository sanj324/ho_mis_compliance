export const formatDateTime = (value: string | Date): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));

export const startOfDay = (value = new Date()): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());
