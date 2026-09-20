import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TransactionItem from "./TransactionItem";
import groupByDay from "../utils/groupByDay";

const Container = styled.div``;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.lg};
  transition: border-color 150ms ease, box-shadow 150ms ease,
    background-color 150ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focusRing};
  }
`;

const TransactionItems = styled.div``;

/* A motion component so a day can animate away with its last transaction.
   Rendering the group behind a plain length check would unmount it — and the
   AnimatePresence inside it — before that row's exit could run. */
const DayGroup = styled(motion.section)`
  overflow: hidden;

  & + & {
    margin-top: ${({ theme }) => theme.space.lg};
  }
`;

const DayLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const EmptyState = styled.p`
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.size.sm};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const TransactionsContainer = ({ transactions, removeTransaction }) => {
  const [searchInput, setSearchInput] = useState("");
  const reduceMotion = useReducedMotion();

  const filteredTransactions = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return transactions;

    // Match the category too, so "food" finds everything filed under it.
    return transactions.filter(
      (item) =>
        item.details.toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query)
    );
  }, [transactions, searchInput]);

  const groupedTransactions = useMemo(
    () => groupByDay(filteredTransactions),
    [filteredTransactions]
  );

  return (
    <Container>
      <Heading>Transactions</Heading>

      <SearchInput
        type="text"
        placeholder="Search here"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <TransactionItems>
        {/* AnimatePresence stays mounted even when the list empties: if it
            unmounts with the last row, that row's exit animation is skipped
            and it snaps away instead of collapsing. */}
        <AnimatePresence initial={false}>
          {groupedTransactions.map((group) => (
            <DayGroup
              key={group.key}
              layout={!reduceMotion}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, marginTop: 0 }
              }
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              <DayLabel>{group.label}</DayLabel>
              <AnimatePresence initial={false}>
                {group.items.map((transaction) => (
                  <TransactionItem
                    transaction={transaction}
                    key={transaction.id}
                    removeTransaction={removeTransaction}
                  />
                ))}
              </AnimatePresence>
            </DayGroup>
          ))}
        </AnimatePresence>

        {!filteredTransactions?.length && (
          <EmptyState>
            {searchInput.trim()
              ? `No transactions match “${searchInput.trim()}”.`
              : "No transactions yet. Add one to get started."}
          </EmptyState>
        )}
      </TransactionItems>
    </Container>
  );
};

export default TransactionsContainer;