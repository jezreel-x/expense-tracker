import { DEFAULT_CATEGORY } from "../constants/categories";

// Transactions saved before categories existed have no `category` field.
// Rather than rejecting them, fill the gap on read so old data keeps working.
const normalizeTransaction = (transaction) => {
  if (!transaction || typeof transaction !== "object") return null;

  const category =
    typeof transaction.category === "string" && transaction.category.trim()
      ? transaction.category.trim()
      : DEFAULT_CATEGORY;

  return { ...transaction, category };
};

export default normalizeTransaction;
