import React, { useState } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";
import CategoryField from "./CategoryField";
import { Input } from "./ui/fields";
import formatCurrency from "../utils/formatCurrency";

const Item = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  /* Clips the accent stripe below to the rounded corners. */
  overflow: hidden;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  padding-left: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.sm};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  /* A full-height stripe. As a border-left it would be eaten by the
     corner radius and survive only as a short tick in the middle. */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background-color: ${({ theme, $isExpense }) =>
      $isExpense ? theme.colors.negative : theme.colors.positive};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    row-gap: ${({ theme }) => theme.space.sm};
  }
`;

const DetailsBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  align-items: flex-start;

  /* Narrow screens: description takes its own line so the amount and the
     Remove button are not squeezed to a few characters each. */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-basis: 100%;
  }
`;

const Details = styled.span`
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text};
`;

/* Neutral rather than colour-coded per category: categories are open-ended
   (users can add their own), so there is no fixed palette to assign from. */
const CategoryChip = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 2px ${({ theme }) => theme.space.sm};
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Amount = styled.span`
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ theme, $isExpense }) =>
    $isExpense ? theme.colors.negative : theme.colors.positive};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: auto;
  }
`;

const EditRow = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const EditActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  justify-content: flex-end;
`;

const GhostButton = styled.button`
  flex-shrink: 0;
  background: none;
  color: ${({ theme }) => theme.colors.textSubtle};
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.accentSoft};
  }
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textInverse};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.accentHover};
    border-color: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSubtle};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: none;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const RemoveButton = styled.button`
  flex-shrink: 0;
  background: none;
  color: ${({ theme }) => theme.colors.textSubtle};
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.negative};
    background-color: ${({ theme }) => theme.colors.negativeSoft};
    border-color: ${({ theme }) => theme.colors.negativeSoft};
  }
`;

const TransactionItem = ({
  transaction,
  removeTransaction,
  updateTransaction
}) => {
  const isExpense = transaction?.transType === "expense";
  const reduceMotion = useReducedMotion();

  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [details, setDetails] = useState(transaction.details);
  const [category, setCategory] = useState(transaction.category || "");

  // Reset the draft from the saved values, so cancelling discards edits and
  // reopening never shows a stale draft.
  const startEditing = () => {
    setAmount(String(transaction.amount));
    setDetails(transaction.details);
    setCategory(transaction.category || "");
    setIsEditing(true);
  };

  const canSave =
    Number(amount) > 0 && details.trim().length > 0 && category.trim().length > 0;

  const save = () => {
    if (!canSave) return;

    updateTransaction(transaction.id, {
      amount: Number(amount),
      details: details.trim(),
      category: category.trim()
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditRow
        $isExpense={isExpense}
        layout={!reduceMotion}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
      >
        <Input
          type="number"
          aria-label="Edit amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input
          type="text"
          aria-label="Edit details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
        <CategoryField
          value={category}
          onChange={setCategory}
          selectLabel="Edit category"
          customLabel="Edit custom category"
        />
        <EditActions>
          <SaveButton onClick={save} disabled={!canSave}>
            Save
          </SaveButton>
          <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
        </EditActions>
      </EditRow>
    );
  }

  return (
    <Item
      $isExpense={isExpense}
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, x: -16, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }
      }
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      <DetailsBlock>
        <Details>{transaction.details}</Details>
        {transaction.category && (
          <CategoryChip>{transaction.category}</CategoryChip>
        )}
      </DetailsBlock>
      <Amount $isExpense={isExpense}>
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount)}
      </Amount>
      <GhostButton
        onClick={startEditing}
        aria-label={`Edit ${transaction.details}`}
      >
        Edit
      </GhostButton>
      <RemoveButton
        onClick={() => removeTransaction(transaction.id)}
        aria-label={`Remove ${transaction.details}`}
      >
        Remove
      </RemoveButton>
    </Item>
  );
};

export default TransactionItem;
