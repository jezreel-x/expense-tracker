import { DEFAULT_CATEGORY } from "../constants/categories";

// Transactions saved by earlier versions are missing fields added since.
// Rather than rejecting them, fill what can be filled on read so old data
// keeps working.
//
// `createdAt` is deliberately left absent when missing rather than defaulted
// to now: dating an old entry as today would be inventing information. The
// list groups these under "Earlier" instead.
const normalizeTransaction = (transaction) => {
  if (!transaction || typeof transaction !== "object") return null;

  const category =
    typeof transaction.category === "string" && transaction.category.trim()
      ? transaction.category.trim()
      : DEFAULT_CATEGORY;

  const timestamp = Number(transaction.createdAt);
  const createdAt = Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;

  return { ...transaction, category, createdAt };
};

export default normalizeTransaction;
