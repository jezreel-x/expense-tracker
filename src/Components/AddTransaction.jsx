import { useState } from "react";
import styled, { keyframes } from "styled-components";
import makeId from "../utils/makeId";
import {
  PRESET_CATEGORIES,
  DEFAULT_CATEGORY,
  CUSTOM_CATEGORY
} from "../constants/categories";

const expand = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.xl};
  animation: ${expand} 180ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }
`;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const Label = styled.label`
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.text};
`;

/* The whole pill is the hit target, not just the 13px radio dot. */
const RadioBtn = styled(RadioContainer)`
  flex: 1;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.accent : theme.colors.border};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.accentSoft : theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;

  & input {
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SubmitBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textInverse};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: background-color 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.accentHover};
    border-color: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.border};
    /* Readable while clearly inactive — white on gray was neither. */
    color: ${({ theme }) => theme.colors.textSubtle};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const AddTransaction = ({ toggle, setToggle, AddTransactions }) => {
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [transType, setTransType] = useState("expense");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [customCategory, setCustomCategory] = useState("");

  const usingCustomCategory = category === CUSTOM_CATEGORY;
  const resolvedCategory = usingCustomCategory
    ? customCategory.trim()
    : category;

  // Without this an empty form submits as "Ksh 0" with a blank description.
  const canSubmit =
    Number(amount) > 0 &&
    details.trim().length > 0 &&
    resolvedCategory.length > 0;

  const AddTransactionData = () => {
    if (!canSubmit) return;

    AddTransactions({
      id: makeId(),
      amount: Number(amount),
      details: details.trim(),
      category: resolvedCategory,
      createdAt: Date.now(),
      transType: transType
    });
    setToggle(!toggle);
  };

  return (
    <Container>
      <Input
        type={"number"}
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <Input
        type={"text"}
        placeholder="Enter Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <Select
        aria-label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {PRESET_CATEGORIES.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
        <option value={CUSTOM_CATEGORY}>Custom category…</option>
      </Select>

      {usingCustomCategory && (
        <Input
          type="text"
          aria-label="Custom category"
          placeholder="Name your category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      )}

      <RadioGroup>
        <RadioBtn $checked={transType === "expense"}>
          <input
            type="radio"
            id="expense"
            name="type"
            value={"expense"}
            checked={transType === "expense"}
            onChange={(e) => setTransType(e.target.value)}
          />
          <Label htmlFor="expense">Expense</Label>
        </RadioBtn>

        <RadioBtn $checked={transType === "income"}>
          <input
            type="radio"
            id="income"
            name="type"
            value={"income"}
            checked={transType === "income"}
            onChange={(e) => setTransType(e.target.value)}
          />
          <Label htmlFor="income">Budget</Label>
        </RadioBtn>
      </RadioGroup>

      <SubmitBtn onClick={AddTransactionData} disabled={!canSubmit}>
        Add transaction
      </SubmitBtn>
    </Container>
  );
};

export default AddTransaction;