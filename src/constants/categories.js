// Presets cover the common cases; anything else is entered as a custom
// category, so the list never has to be exhaustive.
export const PRESET_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Salary",
  "Other"
];

export const DEFAULT_CATEGORY = "Other";

// Sentinel for the "add your own" option in the select. Not a real category:
// it is swapped for the typed value before a transaction is saved.
export const CUSTOM_CATEGORY = "__custom__";
