import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import TransactionItem from "./TransactionItem";

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

  const filteredTransactions = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return transactions;

    return transactions.filter((item) =>
      item.details.toLowerCase().includes(query)
    );
  }, [transactions, searchInput]);

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
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              transaction={transaction}
              key={transaction.id}
              removeTransaction={removeTransaction}
            />
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