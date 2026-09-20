import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';
import { getTheme } from './theme';
import useThemeMode from './hooks/useThemeMode';
import Tracker from './Components/Tracker';


const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  /* Top-aligned, not centered: a centred card shifts up the page as the
     transaction list grows. */
  align-items: flex-start;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space["3xl"]} ${({ theme }) => theme.space.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};
  }
`;

function App() {
  const { mode, toggle } = useThemeMode();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <GlobalStyle />
      <MainDiv>
        <Tracker mode={mode} onToggleTheme={toggle} />
      </MainDiv>
    </ThemeProvider>
  )
}

export default App;
