import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  100% {
    transform: rotateY(360deg);
  }
`;

const LoaderContainer = styled.div`
  transform: rotateX(70deg);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Element = styled.span<{ index: number }>`
  display: block;
  border-left: 5px solid rgb(120, 47, 255);
  border-right: 5px solid rgb(120, 47, 255);
  border-top: dotted 2px rgb(92, 5, 114);
  width: 10rem;
  height: 1rem;
  margin-top: 0.5rem;
  perspective: 1000px;
  animation: ${rotate} 5s infinite linear;
  animation-delay: ${({ index }) => index * 0.2}s;
`;

const Loader: React.FC = () => {
  return (
    <LoaderContainer>
      {Array.from({ length: 15 }).map((_, i) => (
        <Element key={i} index={i + 1} />
      ))}
    </LoaderContainer>
  );
};

export default Loader;
