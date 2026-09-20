// Single place that decides how money is rendered, so every amount in the UI
// matches. Falls back to a plain number if the value is not usable.
const formatCurrency = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "Ksh 0";

  return `Ksh ${value.toLocaleString("en-KE")}`;
};

export default formatCurrency;
