const DAY_MS = 24 * 60 * 60 * 1000;

// Key transactions by local calendar day, not by UTC: a transaction added at
// 1am should file under that day for the person who added it.
const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatDayLabel = (date, now = new Date()) => {
  const diffDays = Math.round(
    (startOfDay(now) - startOfDay(date)) / DAY_MS
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  // Within the current year the year itself is noise; older entries need it.
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" })
  });
};

// Groups newest day first, and newest transaction first within each day.
// Entries with no timestamp (saved before dates were recorded) collect in a
// trailing "Earlier" group rather than being given an invented date.
const groupByDay = (transactions, now = new Date()) => {
  const groups = new Map();
  const undated = [];

  transactions.forEach((transaction) => {
    const timestamp = Number(transaction.createdAt);

    if (!Number.isFinite(timestamp) || timestamp <= 0) {
      undated.push(transaction);
      return;
    }

    const date = new Date(timestamp);
    const key = dayKey(date);

    if (!groups.has(key)) {
      groups.set(key, { key, label: formatDayLabel(date, now), items: [] });
    }
    groups.get(key).items.push(transaction);
  });

  const dated = [...groups.values()]
    .sort((a, b) => (a.key < b.key ? 1 : -1))
    .map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) => b.createdAt - a.createdAt)
    }));

  if (undated.length) {
    dated.push({ key: "undated", label: "Earlier", items: undated });
  }

  return dated;
};

export default groupByDay;
