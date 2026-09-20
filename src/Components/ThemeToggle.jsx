import React from "react";
import styled from "styled-components";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: color 150ms ease, background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const ThemeToggle = ({ mode, onToggle }) => {
  const isDark = mode === "dark";

  return (
    <Button
      type="button"
      onClick={onToggle}
      // The icon alone carries no text, so the control needs a name — and
      // it should say what clicking does, not what the state currently is.
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggle;
