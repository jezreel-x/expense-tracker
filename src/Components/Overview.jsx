import styled from "styled-components";
import formatCurrency from "../utils/formatCurrency";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};
  flex-wrap: wrap;
`;

const BalanceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const BalanceLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BalanceAmount = styled.span`
  font-size: ${({ theme }) => theme.typography.size["2xl"]};
  transition: color 150ms ease;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $isNegative }) =>
    $isNegative ? theme.colors.negative : theme.colors.text};
`;

const AddBtn = styled.button`
  flex-shrink: 0;
  cursor: pointer;
  background-color: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.surface : theme.colors.accent};
  color: ${({ theme, $isOpen }) =>
    $isOpen ? theme.colors.textMuted : theme.colors.textInverse};
  border: 1px solid
    ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.borderStrong : theme.colors.accent};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme, $isOpen }) =>
    $isOpen ? "none" : theme.shadows.sm};
  transition: background-color 150ms ease, border-color 150ms ease,
    color 150ms ease;

  &:hover {
    background-color: ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.surfaceMuted : theme.colors.accentHover};
    border-color: ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.borderStrong : theme.colors.accentHover};
    color: ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.text : theme.colors.textInverse};
  }
`;

const Overview = ({ toggle, setToggle, income, expense }) => {
  const bal = income - expense;

  return (
    <Container>
      <BalanceBlock>
        <BalanceLabel>Balance</BalanceLabel>
        <BalanceAmount $isNegative={bal < 0}>
          {formatCurrency(bal)}
        </BalanceAmount>
      </BalanceBlock>

      <AddBtn $isOpen={toggle} onClick={() => setToggle(!toggle)}>
        {toggle ? "Cancel" : "Add transaction"}
      </AddBtn>
    </Container>
  );
};

export default Overview;
