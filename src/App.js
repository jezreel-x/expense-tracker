import React from 'react';
import './App.css';
import styled from 'styled-components';
import GlobalStyle from './globalStyles';
import Tracker from './Components/Tracker';


const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  return (
    <MainDiv>
      <GlobalStyle />
      <Tracker />
    </MainDiv>
  )
}

export default App;
