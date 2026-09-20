// crypto.randomUUID() is only defined in a secure context (HTTPS or
// localhost) and is absent in jsdom, so it cannot be relied on alone.
const makeId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default makeId;
