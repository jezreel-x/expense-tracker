import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.main};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const MyComponent = () => {
    return (
        <div>
            <StyledButton>Click Me</StyledButton>
        </div>
    )
};

export default MyComponent;