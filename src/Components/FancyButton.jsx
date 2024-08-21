import React from "react";
import styled, { keyframes } from "styled-components";
import Button from "./Button";

const fadeIn = keyframes`
    to {
        opacity: 1;
        transform: scale(1.2);
    }
`;

export const FancyButton = styled(Button)`
    background-image: linear-gradient(to right, #f6d365 0%, #fda085 100%);
    border: none;
    text-decoration: none;
    animation: ${fadeIn} 2s forwards;
    opacity: 0;
    transform: scale(1.0);
`;

const MainFancyBtn = ({ children, isOpen }) => {

    if (!isOpen) return null;

    return (
        <div>
            {children}
        </div>
    )
};

export default MainFancyBtn;