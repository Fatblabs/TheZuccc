/*
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

*/

var usernameElement = document.getElementById('UsernameElement');
var passwordElement = document.getElementById('PasswordElement');
var LoginButton = document.getElementById('LoginButton');

var textIsPresentinBoth = false;

var username = "";
var password = "";

//const LoginButtonDisabled = LoginButton.cloneNode(true);
//const LoginButtonEnabled = document.createElement('input-box');



function checkInputs() {
  LoginButton.disabled = !(username.trim() != "" && password.trim() != "");
}

usernameElement.addEventListener('input', function(event) {
  username = event.target.value;
  checkInputs();
  //console.log(event.target.value);
})

passwordElement.addEventListener('input', function(event) {
  password = event.target.value;
  checkInputs();
  //console.log(event.target.value);
})
