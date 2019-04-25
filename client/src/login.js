import React, { Component } from 'react';
import { Link,Prompt } from 'react-router-dom';
import logo from './logo.svg';
import './login.css';
import { Button, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";

class login extends Component {

  onClickLogin = ( logsin ) => {

      var username = document.getElementById("usernameID").value

      var obj = JSON.stringify({
          "username": username,
          "password": document.getElementById("passwordID").value
      })

      document.getElementById("usernameID").value = ""
      document.getElementById("passwordID").value = ""

      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/api/" + logsin, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.onreadystatechange = function ()
      {
          if ( this.readyState === 4 && this.status === 200 )
          {

              var response = JSON.parse(this.responseText);
              console.log(response);

              if ( response.status === "okay" )
              {
                  localStorage.token = response.token;
                  localStorage.account = username;

                  window.location.replace("/chat/main")
              }
              else if ( response.status === "fail" )
              {
                  alert( response.reason )
              }
          }
      };
      xhttp.send(obj);
  }

  render() {
   return (
    <div className="login">
      <Form className="loginForm">

        <Form.Group className="usernameForm">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" id="usernameID"/>
        </Form.Group>

        <Form.Group className="usernameForm">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" id="passwordID" />
        </Form.Group>

        <Button className="button" onClick={() => this.onClickLogin("signup")} id="signupButton" type="submit">Sign-Up</Button>
        <Button className="button" onClick={() => this.onClickLogin("login")} id="loginButton" type="submit">Log-In</Button>

      </Form>
    </div>
   );
  }
}

export default login;
