import styled, { keyframes } from 'styled-components';

const Button = styled.button`
    color: ${({ variant }) => variant === 'outline' ? '#4caf50': '#fff'};
    background-color: ${({ variant }) => variant === 'outline' ? '#fff': '#4caf50'};
    display: flex;
    margin: auto;
    margin-top: 12px;
    font-size: 19px;
    font-family: Georgia;
    border: 2px solid #4caf50;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    &:hover {
        color: ${({ variant }) => variant !== 'outline' ? '#4caf50': '#fff'};
        background-color: ${({ variant }) => variant !== 'outline' ? '#fff': '#4caf50'};
        transform: scale(1.1);
        transition: 1s ease-in-out;
    }
`;

const fadeIn = keyframes`
    to {
        opacity: 1;
        transform: scale(1.2);
    }
`;

export const MainDiv = styled.div`
    display: flex;
    flex-direction: row;
    width: 480px;
    margin: auto;
    padding: 12px;
`;

export const FancyButton = styled(Button)`
    background-image: linear-gradient(to right, #f6d365 0%, #fda085 100%);
    border: none;
    text-decoration: none;
    animation: ${fadeIn} 2s ease-in-out;
    opacity: 0;
    transform: scale(1.0);
`;

export const SubmitButton = styled(Button).attrs({
    type: 'submit'
})`
    &:active {
        background-color: ${({ variant }) => variant !== 'outline' ? '#fff': '#4caf50'};
        box-shadow: 0 6px #666;
        transform: translateY(4px);
    }
`;



export default Button;