import { useState, useEffect } from "react";
import styled from "styled-components";
import logoImg from "../assets/logo.png";
import theme from "../styles/theme";
import SignUpForm from "../components/SignUpForm";

const Container = styled.div`. 
    background-color: #EFEFEF;
    -webkit-user-select: none;
    webkit-user-drag: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
    user-drag: none; 
`
const Info = styled.div`
    position: absolute;
    left: ${props => props.theme.vw(610)};
    top: ${props => props.theme.vh(76)};
`

const Logo = styled.img`
    width: ${props => props.theme.vw(655)}
    height: ${props => props.theme.vh(147)}
`

export default function SignUp(){
    return (
        <Container>
            <Info>
                <Logo src={logoImg}></Logo>
            </Info>
            <SignUpForm></SignUpForm>
        </Container>
    )
}