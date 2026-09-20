import React, { useState } from "react";
import { Input, Select } from "./ui/fields";
import {
  PRESET_CATEGORIES,
  CUSTOM_CATEGORY
} from "../constants/categories";

// Owns the preset/custom switch so both the add form and the row editor get
// the same behaviour. `value` is always the resolved category name — the
// CUSTOM_CATEGORY sentinel never leaves this component.
const CategoryField = ({
  value,
  onChange,
  selectLabel = "Category",
  customLabel = "Custom category"
}) => {
  // A saved category that is not a preset must have been custom, so the
  // field reopens in custom mode when editing such a transaction.
  const [isCustom, setIsCustom] = useState(
    () => Boolean(value) && !PRESET_CATEGORIES.includes(value)
  );

  const handleSelect = (event) => {
    const next = event.target.value;

    if (next === CUSTOM_CATEGORY) {
      setIsCustom(true);
      // Cleared so the user types a name; submission is blocked until they do.
      onChange("");
      return;
    }

    setIsCustom(false);
    onChange(next);
  };

  return (
    <>
      <Select
        aria-label={selectLabel}
        value={isCustom ? CUSTOM_CATEGORY : value}
        onChange={handleSelect}
      >
        {PRESET_CATEGORIES.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
        <option value={CUSTOM_CATEGORY}>Custom category…</option>
      </Select>

      {isCustom && (
        <Input
          type="text"
          aria-label={customLabel}
          placeholder="Name your category"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </>
  );
};

export default CategoryField;
