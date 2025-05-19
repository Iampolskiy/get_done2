// lib/date.ts
export function formatGermanDateTime(iso?: string | Date | null) {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  const date = d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date}, ${time}`;
}
