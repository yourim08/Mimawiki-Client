import { useState, useEffect } from "react";
import styled from "styled-components";
import logoImg from "../assets/logo.png";
import theme from "../styles/theme";
import LoginForm from "../components/LoginForm";

const Container = styled.div`
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
    left: ${props => props.theme.vw(95)};
    top: ${props => props.theme.vh(383)};
`

export default function Login(){
    return (
        <Container>
            <Info>
                <img src={logoImg}></img>
            </Info>
            <LoginForm/>
        </Container>
    )
}