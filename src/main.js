/*
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

*/

//const { Wait } = require("aws-cdk-lib/aws-stepfunctions");

//const { a } = require("@aws-amplify/backend");

//const { ConsoleLogger } = require("aws-amplify/utils");
//We've created a class so that it can handle these fields, and so that it can handle the 'form' as created in the html file perviously.
class Account {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validation();
  }

  auth(error) {
    if (error == 0) {
      localStorage.setItem("auth", 1);
      this.form.submit();
    }
    else {
      console.log("ERROR");
    }
  }

  validation() {
    //self correlates to all the variable fields in the constructor
    let self = this;
    var user;
    var pass;
    //we add an event listener to the submit button (which is part of a form element in html)
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      let error = 0;
      //For each field
      self.fields.forEach((field) => {
        //Grab the private field
        const input = document.querySelector(`#${field}`);
        //Run Validate Fields to make sure it matches all the requirements for the username and password. +1 error if there is in any of them.
        if (input.type == "password") {
          pass = input.value;
        } else {
          user = input.value;
        }
        if (!this.validateFields(input)) {
          error++;
        }
      });

      if(!checkIfAccountExists(this.fields)) {
        document.getElementById("yesButton").addEventListener("click", (event) => {
          if (!openAccount(user, pass, error)) {
            this.ping("Hey man, sorry for calling you stupid, but something went wrong when trying to create your dumb account", "error");
            error++;
          }
          else {
            error = 0;
            this.auth(error);
          }
        });
      }
      else {
        this.auth(error);
      }
    })
  }

  validateFields(field) {
    //Handles case when either one of the fields are blank
    if (field.value.trim() == "") {
      this.ping("You gotta put something....", "error");
    }
    else {
      //If this is a password Field
      if (field.type == "password") {
        //If the password field is less than 8 characters
        if (field.value.length < 8) {
          this.ping("What, you want your password to be brute forced within seconds? Make password that's more than 8 characters you idiot", "error");
          return false;
        }
        else {
          return true;
        }
      }
      //If this is a username field
      else {
        //If the username field is less than 3 characters
        if (field.value.length < 3) {
          this.ping("Dude, are you serious???? You gotta make your username longer than that", "error")
          return false;
        }
        else {
          return true;
        }
      }
    }
  }

  ping(message, status) {
    if (status == "error") {
      let notification = document.createElement("div");
      notification.classList.add("alert", "alert-warning", "alert-dismissible", "fade", "show");
      notification.role = "alert";
      notification.innerHTML = `
        <strong>STUPID!!!</strong> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    document.getElementById("notification-container").appendChild(notification)
    }
    else {
      console.log("Skibidi")
    }
  }
}


//THis is the amount of fields that are needed.
const form = document.querySelector(".loginForm");
console.log(form);
if (form) {
  const fields = ['UsernameElement', 'PasswordElement'];
  const validator = new Account(form, fields);
}


/* Show Password Function */
function showPass() {
  var x = document.getElementById("PasswordElement");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  
}
//CHECK the database if the account exists. Return true if exists. If it doesn't, then prompt user to sign up
function checkIfAccountExists(field) {
  if (true) {
    const loginDiv = document.querySelector(".login");
        loginDiv.style.visibility = "hidden";
        let account = document.getElementById('account');

        account.innerHTML = `
          <h1> Do you want to log in? </h1> 
          <button id = "yesButton" class="yesButton">Yes</button> 
          <button id = "noButton" class="noButton" onclick="closeAccount()">No</button>
        `;
        account.style.visibility = "visible";
  }
  return false;
}

//connects with database and adds new table element containing new user and pass
function openAccount(user, pass, error) {
  //console.log("It works: " + user + " " + pass + " " + error);
  return true;
}
//Reload page cuz we don't need to really do anything after the user presses no when prompted
function closeAccount() {
  location.reload();
}
