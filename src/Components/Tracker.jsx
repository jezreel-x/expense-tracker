import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import AddTransaction from "./AddTransaction";
import Overview from "./Overview";
import TransactionsContainer from "./TransactionsContainer";
import ThemeToggle from "./ThemeToggle";
import formatCurrency from "../utils/formatCurrency";
import normalizeTransaction from "../utils/normalizeTransaction";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;

  /* Two columns once there is room for them. Below this the layout is
     unchanged: a single 600px column. */
  @media (min-width: 900px) {
    max-width: 960px;
  }
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.space["2xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.lg};
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding-bottom: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const Columns = styled.div`
  @media (min-width: 900px) {
    display: grid;
    /* 380px leaves the two stat boxes ~150px of content each, enough for a
       six-figure amount at the size they are set in. */
    grid-template-columns: 380px 1fr;
    gap: ${({ theme }) => theme.space["2xl"]};
    align-items: start;
  }
`;

/* Sticky so the balance and totals stay visible while a long list scrolls —
   which is the point of a tracker. */
const Summary = styled.div`
  @media (min-width: 900px) {
    position: sticky;
    top: ${({ theme }) => theme.space.lg};
  }
`;

const ListColumn = styled.div`
  min-width: 0;
`;

const TransactionDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.md};
  }
`;

const Tagline = styled.p`
  margin-top: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatBox = styled.div`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme, $isExpense }) =>
    $isExpense ? theme.colors.negativeSoft : theme.colors.positiveSoft};

  & > span:first-child {
    display: block;
    font-size: ${({ theme }) => theme.typography.size.xs};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  & > span:last-child {
    display: block;
    margin-top: ${({ theme }) => theme.space.xs};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    font-size: ${({ theme }) => theme.typography.size.lg};
    font-variant-numeric: tabular-nums;
    color: ${({ theme, $isExpense }) =>
      $isExpense ? theme.colors.negative : theme.colors.positive};
  }
`;

const STORAGE_KEY = "expense-tracker:transactions";

const loadTransactions = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Fill in fields added after these entries were saved.
    return parsed.map(normalizeTransaction).filter(Boolean);
  } catch {
    return [];
  }
};

const Tracker = ({ mode, onToggleTheme }) => {
  const [toggle, setToggle] = useState(false);
  const [transactions, setTransactions] = useState(loadTransactions);

  const AddTransactions = (payload) => {
    const transactionArray = [...transactions];
    transactionArray.push(payload);
    setTransactions(transactionArray);
  };

  const updateTransaction = (id, changes) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id ? { ...transaction, ...changes } : transaction
      )
    );
  };

  const removeTransaction = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  };

  const { expense, income } = useMemo(() => {
    return transactions.reduce(
      (totals, item) => {
        if (item.transType === "expense") {
          totals.expense += item.amount;
        } else {
          totals.income += item.amount;
        }
        return totals;
      },
      { expense: 0, income: 0 }
    );
  }, [transactions]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // Storage unavailable (private mode, quota) — the app still works in memory.
    }
  }, [transactions]);

  return (
    <Container>
      <Header>
        <div>
          <Heading>Expense Tracker</Heading>
          <Tagline>A simple way of tracking expenses.</Tagline>
        </div>
        <ThemeToggle mode={mode} onToggle={onToggleTheme} />
      </Header>

      <Columns>
        <Summary>
          <Overview
            toggle={toggle}
            setToggle={setToggle}
            expense={expense}
            income={income}
          />

          {toggle && (
            <AddTransaction
              toggle={toggle}
              setToggle={setToggle}
              AddTransactions={AddTransactions}
            />
          )}

          <TransactionDetails>
            <StatBox $isExpense>
              <span>Expense</span>
              <span>{formatCurrency(expense)}</span>
            </StatBox>

            <StatBox>
              <span>Budget</span>
              <span>{formatCurrency(income)}</span>
            </StatBox>
          </TransactionDetails>
        </Summary>

        <ListColumn>
          <TransactionsContainer
            transactions={transactions}
            removeTransaction={removeTransaction}
            updateTransaction={updateTransaction}
          />
        </ListColumn>
      </Columns>
    </Container>
  );
};

export default Tracker;