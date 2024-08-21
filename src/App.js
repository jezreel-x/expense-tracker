import React from 'react';
import './App.css';
import Button, { FancyButton, MainDiv, SubmitButton } from './Components/Button';
import MainFancyBtn from './Components/FancyButton';

function App() {

  const [isVisible, setIsVisible] = React.useState(false);

  const handleVisibility = () => {
    setIsVisible(true);
  };

  return (
    <MainDiv>
      <Button>Sign Up</Button>
      <Button variant='outline' onClick={handleVisibility}>Log In</Button>
      <MainFancyBtn isOpen = {isVisible}>
        <FancyButton as='a' href='https://youtube.com'>Fancy Button</FancyButton>
      </MainFancyBtn>
      <SubmitButton>Submit</SubmitButton>
    </MainDiv>
  );
}

export default App;
