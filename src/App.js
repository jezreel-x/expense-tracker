import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './globalStyles';
import theme from './theme';
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
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MainDiv>
        <Tracker />
      </MainDiv>
    </ThemeProvider>
  )
}

export default App;
