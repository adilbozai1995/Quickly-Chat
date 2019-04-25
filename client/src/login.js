import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import logo from './logo.svg';
import './login.css';
import { Button, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";

class login extends Component {

  onClickSignup = () => {
  
  }

  onClickLogin = () => {

  }

  render() {
   return (
    <div className="login">
      <Form className="loginForm">

        <Form className="bigForm">
        <Form.Group className="usernameForm">
          <Form.Label>Username :</Form.Label>
          <Form.Control type="username"  id="usernameID"/> 
        </Form.Group>

        <Form.Group className="usernameForm">
          <Form.Label>Password :</Form.Label>
          <Form.Control type="password"  id="passwordID" />
        </Form.Group>

        
        <Button className="button" onClick={() => this.onClickSignup()} id="signupButton" type="submit">Sign-Up</Button>
        <Button className="button" onClick={() => this.onClickLogin()} id="loginButton" type="submit">Log-In</Button>
        </Form>

      </Form>
    </div>
   );
  }
  
}

export default login;
