import styled, { keyframes } from 'styled-components';

export const Container = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 84vh;
`;

export const Container_LP = styled.section`
    width: 85%;
    margin: 3rem auto;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 2px solid blue;
    padding: 30px;
`;

export const RootParent = styled.div`
    min-height: calc(100vh - 80px);
    padding-top: 69px;
`;

export const VideoRoot = styled.section`
    max-width: 700px;
    margin: 2rem auto;
    color: darkgrey;
    padding: 3rem;
    border: 2px dashed grey;
    border-radius: 2rem;
    background-color: lightgrey;
`;

export const Footer_ = styled.footer`
    display: flex;
    height: 8vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: lightgrey;
` ;

export const DivRelative = styled.div`
    position: relative;
`;

export const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`
export const LoadingContainer = styled.div`
    width: 80px;
    margin: 0 auto;
`;

export const LoadingSpinner = styled.div`
    display: block;
    width: 50px;
    height: 50px;
    border: 7px solid salmon;
    border-radius: 50%;
    border-top-color: maroon;
    animation: ${spin} 1s linear infinite;
`;