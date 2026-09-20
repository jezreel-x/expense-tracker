import React from "react";
import styled, { keyframes } from "styled-components";
import formatCurrency from "../utils/formatCurrency";

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Item = styled.div`
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
  animation: ${appear} 180ms ease-out;

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

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Details = styled.span`
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text};

  /* Narrow screens: description takes its own line so the amount and the
     Remove button are not squeezed to a few characters each. */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-basis: 100%;
  }
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

const TransactionItem = ({ transaction, removeTransaction }) => {
  const isExpense = transaction?.transType === "expense";

  return (
    <Item $isExpense={isExpense}>
      <Details>{transaction.details}</Details>
      <Amount $isExpense={isExpense}>
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount)}
      </Amount>
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
